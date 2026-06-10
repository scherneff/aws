/**
 * Embed Globe Block
 *
 * DA Table format (block name row + data rows):
 * | Embed Globe          |                         |                          |
 * | Continent Name       | Region 1\nRegion 2\n... | Edge Loc 1\nEdge Loc 2   |
 *
 * Renders a Three.js 3D interactive globe + side panel with continent tabs,
 * geographic regions accordion, and edge locations accordion — matching
 * the AWS Global Infrastructure page layout.
 */

// ---------------------------------------------------------------------------
// Data parsing
// ---------------------------------------------------------------------------

function parseCellLines(cell) {
  if (!cell) return [];
  // Handle both <br>-separated and newline-separated content
  return cell.innerHTML
    .split(/<br\s*\/?>/gi)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
}

function parseBlockData(block) {
  const rows = [...block.querySelectorAll(':scope > div')].filter(
    (r) => r.querySelectorAll(':scope > div').length >= 2,
  );
  return rows.map((row) => {
    const cells = row.querySelectorAll(':scope > div');
    return {
      name: cells[0]?.textContent.trim() || '',
      regions: parseCellLines(cells[1]),
      edgeLocations: parseCellLines(cells[2]),
    };
  }).filter((c) => c.name);
}

// ---------------------------------------------------------------------------
// Continent → approximate lat/lng for globe hotspot placement
// ---------------------------------------------------------------------------
const COORDS = {
  'North America': { lat: 48, lng: -100 },
  'South America': { lat: -15, lng: -58 },
  Europe: { lat: 52, lng: 15 },
  'Middle East': { lat: 26, lng: 44 },
  Africa: { lat: 2, lng: 22 },
  'Asia Pacific': { lat: 28, lng: 108 },
  'Australia and New Zealand': { lat: -27, lng: 134 },
};

function fallbackCoords(index, total) {
  const lng = (index / total) * 360 - 180;
  return { lat: 20, lng };
}

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

// ---------------------------------------------------------------------------
// Three.js globe
// ---------------------------------------------------------------------------

async function loadThree() {
  if (window.__THREE__) return window.__THREE__;
  const mod = await import('https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js');
  window.__THREE__ = mod;
  return mod;
}

async function buildGlobe(container, continents, onSelect) {
  const THREE = await loadThree();
  const W = container.clientWidth || 480;
  const H = container.clientHeight || 480;
  const R = 1.75;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.z = 5.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(4, 3, 5);
  scene.add(sun);

  // Globe mesh
  const geo = new THREE.SphereGeometry(R, 72, 72);
  const loader = new THREE.TextureLoader();

  const mat = new THREE.MeshPhongMaterial({ color: 0x1a5f7a, shininess: 12 });
  const globe = new THREE.Mesh(geo, mat);
  scene.add(globe);

  loader.load(
    'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg',
    (tex) => { mat.map = tex; mat.needsUpdate = true; },
  );

  // Atmosphere
  const atmosMat = new THREE.MeshPhongMaterial({
    color: 0x3388cc, transparent: true, opacity: 0.07, side: THREE.FrontSide,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.025, 72, 72), atmosMat));

  // Markers + rings
  const markerGroup = new THREE.Group();
  scene.add(markerGroup);

  const mGeo = new THREE.SphereGeometry(0.055, 14, 14);
  const rGeo = new THREE.RingGeometry(0.065, 0.095, 32);

  const markers = [];
  const rings = [];

  continents.forEach((c, i) => {
    const coords = COORDS[c.name] || fallbackCoords(i, continents.length);
    const pos = latLngToVec3(coords.lat, coords.lng, R + 0.04);
    const v = new THREE.Vector3(pos.x, pos.y, pos.z);

    const mMat = new THREE.MeshPhongMaterial({ color: 0x8b5cf6 });
    const m = new THREE.Mesh(mGeo, mMat);
    m.position.copy(v);
    m.userData.index = i;
    markerGroup.add(m);
    markers.push(m);

    const rMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.position.copy(v);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    markerGroup.add(ring);
    rings.push(ring);
  });

  // Raycaster
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(markers);
    if (hits.length) onSelect(hits[0].object.userData.index);
  });

  // Drag orbit
  let drag = false;
  let px = 0; let py = 0;
  let rx = 0; let ry = 0;
  let trx = 0; let try_ = 0;
  let autoSpin = true;

  renderer.domElement.addEventListener('mousedown', (e) => {
    drag = true; autoSpin = false; px = e.clientX; py = e.clientY;
  });
  window.addEventListener('mouseup', () => { drag = false; });
  window.addEventListener('mousemove', (e) => {
    if (!drag) return;
    try_ += (e.clientX - px) * 0.005;
    trx += (e.clientY - py) * 0.005;
    trx = Math.max(-1.1, Math.min(1.1, trx));
    px = e.clientX; py = e.clientY;
  });
  renderer.domElement.addEventListener('touchstart', (e) => {
    drag = true; autoSpin = false;
    px = e.touches[0].clientX; py = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => { drag = false; });
  window.addEventListener('touchmove', (e) => {
    if (!drag) return;
    try_ += (e.touches[0].clientX - px) * 0.005;
    trx += (e.touches[0].clientY - py) * 0.005;
    trx = Math.max(-1.1, Math.min(1.1, trx));
    px = e.touches[0].clientX; py = e.touches[0].clientY;
  }, { passive: true });

  // Resize
  new ResizeObserver(() => {
    const w = container.clientWidth; const h = container.clientHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }).observe(container);

  let t = 0;

  function setActive(idx) {
    markers.forEach((m, i) => {
      m.material.color.setHex(i === idx ? 0xffffff : 0x8b5cf6);
      m.scale.setScalar(i === idx ? 1.6 : 1);
    });
    if (idx >= 0) {
      const c = continents[idx];
      const co = COORDS[c.name] || fallbackCoords(idx, continents.length);
      try_ = -co.lng * (Math.PI / 180);
      trx = co.lat * (Math.PI / 180) * 0.45;
    }
  }

  (function animate() {
    requestAnimationFrame(animate);
    t += 0.016;
    if (autoSpin) try_ += 0.0018;
    rx += (trx - rx) * 0.06;
    ry += (try_ - ry) * 0.06;
    globe.rotation.x = rx; globe.rotation.y = ry;
    markerGroup.rotation.x = rx; markerGroup.rotation.y = ry;

    rings.forEach((ring, i) => {
      const pulse = (Math.sin(t * 2.2 + i) + 1) / 2;
      ring.scale.setScalar(1 + pulse * 0.35);
      ring.material.opacity = 0.55 - pulse * 0.38;
    });
    renderer.render(scene, camera);
  }());

  return { setActive };
}

// ---------------------------------------------------------------------------
// Side panel
// ---------------------------------------------------------------------------

function accordion(label, count, bodyEl, open) {
  const wrap = document.createElement('div');
  wrap.className = 'eg-accordion';

  const btn = document.createElement('button');
  btn.className = 'eg-accordion-btn';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.innerHTML = `
    <span class="eg-accordion-label">
      <span>${label}</span><span class="eg-count">${count}</span>
    </span>
    <span class="eg-accordion-icon" aria-hidden="true"></span>`;

  const body = document.createElement('div');
  body.className = 'eg-accordion-body';
  body.style.maxHeight = open ? '600px' : '0';
  body.appendChild(bodyEl);

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.style.maxHeight = isOpen ? '0' : '600px';
  });

  wrap.append(btn, body);
  return wrap;
}

function renderPanel(panelEl, continents, activeIdx, onSelect) {
  panelEl.innerHTML = '';

  // Tabs
  const tabBar = document.createElement('div');
  tabBar.className = 'eg-tabs';
  continents.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'eg-tab';
    btn.textContent = c.name;
    btn.setAttribute('aria-selected', i === activeIdx ? 'true' : 'false');
    btn.addEventListener('click', () => onSelect(i));
    tabBar.appendChild(btn);
  });

  // Content
  const content = document.createElement('div');
  content.className = 'eg-panel-content';

  const c = continents[activeIdx];

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'eg-panel-hdr';
  hdr.innerHTML = `<span class="eg-badge">AWS Coverage Regions</span><h2 class="eg-panel-title">${c.name}</h2>`;
  content.appendChild(hdr);

  // Regions
  const regList = document.createElement('div');
  const ul = document.createElement('ul');
  ul.className = 'eg-region-list';
  c.regions.forEach((r) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="eg-dot eg-dot-on"></span><span>${r}</span>`;
    ul.appendChild(li);
  });
  const legend = document.createElement('div');
  legend.className = 'eg-legend';
  legend.innerHTML = `
    <span class="eg-legend-item"><span class="eg-dot eg-dot-on"></span>Available</span>
    <span class="eg-legend-item"><span class="eg-dot eg-dot-soon"></span>Coming soon</span>`;
  regList.append(ul, legend);
  content.appendChild(accordion('Geographic Regions', c.regions.length, regList, true));

  // Edge locations
  const edgeWrap = document.createElement('div');
  const azCount = c.regions.length * 3;
  const summary = document.createElement('p');
  summary.className = 'eg-edge-summary';
  summary.textContent = `The AWS Cloud in ${c.name} has approximately ${azCount} Availability Zones within `
    + `${c.regions.length} Geographic Regions, with ${c.edgeLocations.length} Edge Network Locations.`;
  const grid = document.createElement('div');
  grid.className = 'eg-edge-grid';
  c.edgeLocations.forEach((loc) => {
    const d = document.createElement('div');
    d.textContent = loc;
    grid.appendChild(d);
  });
  edgeWrap.append(summary, grid);
  content.appendChild(accordion('Edge Locations', c.edgeLocations.length, edgeWrap, false));

  panelEl.append(tabBar, content);
}

// ---------------------------------------------------------------------------
// Block decorator
// ---------------------------------------------------------------------------

export default async function decorate(block) {
  const continents = parseBlockData(block);
  if (!continents.length) {
    block.textContent = 'No data. Add continent rows to the Globe table.';
    return;
  }

  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'eg-wrapper';

  const globeCol = document.createElement('div');
  globeCol.className = 'eg-globe-col';
  const globeContainer = document.createElement('div');
  globeContainer.className = 'eg-globe-container';
  const hint = document.createElement('p');
  hint.className = 'eg-hint';
  hint.textContent = 'Drag to rotate · Click region to explore';
  globeCol.append(globeContainer, hint);

  const panelCol = document.createElement('div');
  panelCol.className = 'eg-panel-col';

  wrapper.append(globeCol, panelCol);
  block.appendChild(wrapper);

  let activeIdx = 0;
  let globeCtrl = null;

  function selectContinent(idx) {
    activeIdx = idx;
    if (globeCtrl) globeCtrl.setActive(idx);
    renderPanel(panelCol, continents, idx, selectContinent);
  }

  // Init panel immediately, globe after paint
  renderPanel(panelCol, continents, activeIdx, selectContinent);
  requestAnimationFrame(async () => {
    globeCtrl = await buildGlobe(globeContainer, continents, selectContinent);
    globeCtrl.setActive(0);
  });
}
