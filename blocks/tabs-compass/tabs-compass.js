let tabBlockCnt = 0;

const CHEVRON_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M8.00004 12.5C7.74004 12.5 7.49004 12.4 7.29004 12.21L0.290039 5.21005L1.70004 3.80005L7.99004 10.09L14.28 3.80005L15.69 5.21005L8.69004 12.21C8.49004 12.41 8.24004 12.5 7.98004 12.5H8.00004Z"/></svg>';

function groupCards(cell) {
  const children = [...cell.children];
  const cards = [];
  let currentCard = null;
  children.forEach((el) => {
    if (el.tagName === 'H3') {
      currentCard = document.createElement('div');
      currentCard.className = 'tabs-compass-card';
      cards.push(currentCard);
    }
    if (currentCard) currentCard.append(el);
  });
  cell.innerHTML = '';
  cards.forEach((card) => cell.append(card));
}

function buildDropdown(block, labels, panels) {
  const heading = document.createElement('p');
  heading.className = 'tabs-compass-heading';

  const prefix = document.createElement('span');
  prefix.className = 'tabs-compass-prefix';
  prefix.textContent = 'I want to see new customer stories in ';

  const triggerWrapper = document.createElement('span');
  triggerWrapper.className = 'tabs-compass-trigger-wrapper';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'tabs-compass-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const triggerLabel = document.createElement('span');
  triggerLabel.className = 'tabs-compass-trigger-label';
  triggerLabel.textContent = labels[0] || '';

  const chevron = document.createElement('span');
  chevron.className = 'tabs-compass-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML = CHEVRON_SVG;

  trigger.append(triggerLabel, chevron);

  const dropdown = document.createElement('ul');
  dropdown.className = 'tabs-compass-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;

  function selectOption(idx) {
    triggerLabel.textContent = labels[idx] || '';
    panels.forEach((p, i) => p.setAttribute('aria-hidden', i !== idx));
    [...dropdown.children].forEach((opt, i) => opt.setAttribute('aria-selected', i === idx));
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
  }

  labels.forEach((label, i) => {
    const li = document.createElement('li');
    li.className = 'tabs-compass-option';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', i === 0);
    li.tabIndex = -1;
    li.textContent = label;
    li.addEventListener('click', () => selectOption(i));
    dropdown.append(li);
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isOpen));
    dropdown.hidden = isOpen;
    if (!isOpen) dropdown.querySelector('[role=option]')?.focus();
  });

  document.addEventListener('click', () => {
    if (!dropdown.hidden) {
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.hidden = true;
    }
  }, { passive: true });

  dropdown.addEventListener('keydown', (e) => {
    const opts = [...dropdown.querySelectorAll('[role=option]')];
    const idx = opts.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      opts[Math.min(idx + 1, opts.length - 1)]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      opts[Math.max(idx - 1, 0)]?.focus();
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (idx >= 0) selectOption(idx);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.hidden = true;
      trigger.focus();
    }
  });

  triggerWrapper.append(trigger, dropdown);
  heading.append(prefix, triggerWrapper);
  block.prepend(heading);
}

function buildTabList(block, labels, panels) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-compass-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt}`;

  labels.forEach((label, i) => {
    const id = panels[i].id;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tabs-compass-tab';
    btn.id = `tab-${id}`;
    btn.textContent = label;
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-selected', i === 0);
    btn.setAttribute('role', 'tab');
    panels[i].setAttribute('aria-labelledby', btn.id);

    btn.addEventListener('click', () => {
      panels.forEach((p) => p.setAttribute('aria-hidden', true));
      [...tablist.querySelectorAll('button')].forEach((b) => b.setAttribute('aria-selected', false));
      panels[i].setAttribute('aria-hidden', false);
      btn.setAttribute('aria-selected', true);
    });

    tablist.append(btn);
  });

  block.prepend(tablist);
}

export default async function decorate(block) {
  tabBlockCnt += 1;
  const isCustomerStories = block.classList.contains('customer-stories');

  // Extract tab labels and set up panels (each row → panel; label cell removed)
  const rows = [...block.children].filter(
    (row) => row.firstElementChild?.children.length > 0,
  );

  const labels = rows.map((row) => {
    const labelCell = row.firstElementChild;
    const label = labelCell.textContent.trim();
    labelCell.remove();
    return label;
  });

  rows.forEach((row, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;
    row.className = 'tabs-compass-panel';
    row.id = id;
    row.setAttribute('role', 'tabpanel');
    row.setAttribute('aria-hidden', i !== 0);
  });

  const panels = rows;

  // Group card content within each panel's cell
  block.querySelectorAll('.tabs-compass-panel > div').forEach(groupCards);

  if (isCustomerStories) {
    buildDropdown(block, labels, panels);
  } else {
    buildTabList(block, labels, panels);
  }
}
