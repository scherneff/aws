/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-gradient.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2, h3");
    const description = element.querySelector("p");
    const ctaLink = element.querySelector("a[href]");
    const image = element.querySelector("img");
    const imageCell = [];
    if (image) {
      const frag = document.createDocumentFragment();
      frag.appendChild(image);
      imageCell.push(frag);
    }
    const textCell = [];
    const textFrag = document.createDocumentFragment();
    if (heading) {
      textFrag.appendChild(heading);
    }
    if (description) {
      textFrag.appendChild(description);
    }
    if (ctaLink) {
      const ctaParagraph = document.createElement("p");
      const strong = document.createElement("strong");
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      strong.appendChild(link);
      ctaParagraph.appendChild(strong);
      textFrag.appendChild(ctaParagraph);
    }
    textCell.push(textFrag);
    const cells = [];
    if (imageCell.length > 0) {
      cells.push(imageCell);
    }
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-gradient", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-editorial.js
  function parse2(element, { document }) {
    const cardContainer = element.querySelector(".rgic_0f10b411");
    const container = cardContainer || element;
    const cardWrappers = container.querySelectorAll(":scope > .rgic_7ca45506.rgic_c79807e3");
    const cards = cardWrappers.length > 0 ? cardWrappers : element.querySelectorAll(".rgic_c9184425");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.rgic_8e9ae6ea");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        picture.appendChild(imgEl);
        imageFrag.appendChild(picture);
      }
      const textFrag = document.createDocumentFragment();
      const badge = card.querySelector("span.rgic_beb26dc7");
      if (badge) {
        const badgeEl = document.createElement("p");
        badgeEl.textContent = badge.textContent.trim();
        badgeEl.setAttribute("class", "badge");
        textFrag.appendChild(badgeEl);
      }
      const heading = card.querySelector("h4.rgic_7047aa37, h3, h2");
      if (heading) {
        const h = document.createElement("h4");
        h.textContent = heading.textContent.trim();
        textFrag.appendChild(h);
      }
      const description = card.querySelector('span.rgic_98b54368, .rgic_b31c11ca span[class*="rgic_3a1f8f93"]');
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textFrag.appendChild(p);
      }
      const cardLink = card.querySelector("a.rgic_f64fcab2");
      const ctaText = card.querySelector("span.rgic_82d7eac3");
      if (cardLink && ctaText) {
        const a = document.createElement("a");
        a.href = cardLink.href;
        a.textContent = ctaText.textContent.trim();
        textFrag.appendChild(a);
      } else if (cardLink) {
        const a = document.createElement("a");
        a.href = cardLink.href;
        a.textContent = heading ? heading.textContent.trim() : "Learn more";
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-deluxe.js
  function parse3(element, { document }) {
    const slideContainers = element.querySelectorAll("#carousel-items > .rgca_d59560c1, .rgca_f1665d34 > .rgca_d59560c1");
    const cells = [];
    slideContainers.forEach((slideContainer) => {
      const bgImg = slideContainer.querySelector(".rgca_2fcaa65b img");
      const imageCell = [];
      if (bgImg) {
        const imgClone = bgImg.cloneNode(true);
        if (!imgClone.getAttribute("alt") || imgClone.getAttribute("alt") === "") {
          const slideHeading = slideContainer.querySelector("h2");
          if (slideHeading) {
            imgClone.setAttribute("alt", slideHeading.textContent.trim());
          }
        }
        imageCell.push(imgClone);
      }
      const contentCell = [];
      const categoryBadge = slideContainer.querySelector('.rgca_d54eb7cb span[class*="rgca_beb26dc7"]');
      if (categoryBadge) {
        const p = document.createElement("p");
        p.textContent = categoryBadge.textContent.trim();
        contentCell.push(p);
      }
      const logoImg = slideContainer.querySelector("img.rgca_8e9ae6ea");
      if (logoImg) {
        const logoClone = logoImg.cloneNode(true);
        contentCell.push(logoClone);
      }
      const heading = slideContainer.querySelector(".rgca_3c998476 h2, .rgca_5e6ec02e h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        contentCell.push(h2);
      }
      const cardLink = slideContainer.querySelector('a.group-hover, a[class*="rgca_fc949a28"]');
      if (cardLink) {
        const ctaTextEl = slideContainer.querySelector('.rgca_4af30717 span, .rgca_02e87eb9 span[class*="rgca_82d7eac3"]');
        const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "View the story";
        const a = document.createElement("a");
        a.href = cardLink.href;
        a.textContent = ctaText;
        contentCell.push(a);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-deluxe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-compass.js
  function parse4(element, { document }) {
    const dropdownSpan = element.querySelector(".compass_e8457524 > span");
    const dropdownLabel = dropdownSpan || element.querySelector(".compass_6ffdde71 span:first-child");
    const tabTitle = dropdownLabel ? dropdownLabel.textContent.trim() : "Default";
    const cardLinks = Array.from(element.querySelectorAll("a.compass_f64fcab2"));
    const contentCell = document.createDocumentFragment();
    if (cardLinks.length > 0) {
      cardLinks.forEach((cardLink, idx) => {
        const cardImage = cardLink.querySelector("img.compass_8e9ae6ea");
        const cardHeading = cardLink.querySelector("h3, h4, h5");
        const cardDesc = cardLink.querySelector('[class*="compass_98b54368"], [class*="compass_3a1f8f93"]');
        const ctaText = cardLink.querySelector('[class*="compass_82d7eac3"], [class*="compass_4af30717"] span');
        if (idx === 0) {
          if (cardHeading) {
            const h3 = document.createElement("h3");
            h3.textContent = cardHeading.textContent.trim();
            contentCell.appendChild(h3);
          }
          if (cardImage && !cardImage.src.startsWith("data:")) {
            const img = document.createElement("img");
            img.src = cardImage.src;
            img.alt = cardImage.alt || "";
            contentCell.appendChild(img);
          }
          if (cardDesc) {
            const p = document.createElement("p");
            p.textContent = cardDesc.textContent.trim();
            contentCell.appendChild(p);
          }
          if (ctaText && cardLink.href) {
            const link = document.createElement("a");
            link.href = cardLink.href;
            link.textContent = ctaText.textContent.trim();
            contentCell.appendChild(link);
          }
        } else {
          if (cardHeading) {
            const h3 = document.createElement("h3");
            h3.textContent = cardHeading.textContent.trim();
            contentCell.appendChild(h3);
          }
          if (cardImage && !cardImage.src.startsWith("data:")) {
            const img = document.createElement("img");
            img.src = cardImage.src;
            img.alt = cardImage.alt || "";
            contentCell.appendChild(img);
          }
          if (cardDesc) {
            const p = document.createElement("p");
            p.textContent = cardDesc.textContent.trim();
            contentCell.appendChild(p);
          }
          if (ctaText && cardLink.href) {
            const link = document.createElement("a");
            link.href = cardLink.href;
            link.textContent = ctaText.textContent.trim();
            contentCell.appendChild(link);
          }
        }
      });
    } else {
      const panels = Array.from(element.querySelectorAll('[class*="compass_12089782"] [class*="compass_b31c11ca"]'));
      if (panels.length > 0) {
        panels.forEach((panel) => {
          const headings = panel.querySelectorAll("h2, h3, h4, h5");
          const descriptions = panel.querySelectorAll('span[class*="compass_98b54368"]');
          const links = panel.querySelectorAll('a[href]:not([href^="data:"])');
          headings.forEach((h) => {
            const el = document.createElement("h3");
            el.textContent = h.textContent.trim();
            contentCell.appendChild(el);
          });
          descriptions.forEach((d) => {
            const el = document.createElement("p");
            el.textContent = d.textContent.trim();
            if (el.textContent) contentCell.appendChild(el);
          });
          links.forEach((a) => {
            if (a.href) {
              const el = document.createElement("a");
              el.href = a.href;
              el.textContent = a.textContent.trim() || "Learn more";
              contentCell.appendChild(el);
            }
          });
        });
      }
    }
    const titleCell = document.createDocumentFragment();
    const titleEl = document.createElement("p");
    titleEl.textContent = tabTitle;
    titleCell.appendChild(titleEl);
    const cells = [
      [titleCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-compass", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-industry.js
  function parse5(element, { document }) {
    const gridContainer = element.querySelector(".rgic_0f10b411");
    const container = gridContainer || element;
    const cardWrappers = container.querySelectorAll(".rgic_c9184425");
    const cells = [];
    cardWrappers.forEach((cardWrapper) => {
      const link = cardWrapper.querySelector("a.rgic_f64fcab2");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const img = cardWrapper.querySelector("img.rgic_8e9ae6ea");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", img.getAttribute("src") || "");
        imgEl.setAttribute("alt", img.getAttribute("alt") || "");
        picture.appendChild(imgEl);
        imageFrag.appendChild(picture);
      }
      const heading = cardWrapper.querySelector("h4.rgic_7047aa37, h4");
      const description = cardWrapper.querySelector("span.rgic_3a1f8f93");
      const ctaText = cardWrapper.querySelector("span.rgic_82d7eac3");
      const textFrag = document.createDocumentFragment();
      if (heading) {
        const h4 = document.createElement("h4");
        h4.textContent = heading.textContent.trim();
        textFrag.appendChild(h4);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textFrag.appendChild(p);
      }
      if (href) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = ctaText ? ctaText.textContent.trim() : "View industry";
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-globe.js
  function parse6(element, { document }) {
    const heading = element.querySelector("h2");
    const description = element.querySelector("h5");
    const regionButtons = Array.from(element.querySelectorAll("ul li button span"));
    const regions = regionButtons.map((span) => span.textContent.trim()).filter((text) => text.length > 0);
    const wrapper = document.createElement("div");
    if (heading) {
      wrapper.appendChild(heading);
    }
    if (description) {
      wrapper.appendChild(description);
    }
    if (regions.length > 0) {
      const regionsP = document.createElement("p");
      regionsP.textContent = `Regions: ${regions.join(", ")}`;
      wrapper.appendChild(regionsP);
    }
    const embedLink = document.createElement("a");
    embedLink.href = "https://aws.amazon.com/about-aws/global-infrastructure/";
    embedLink.textContent = "https://aws.amazon.com/about-aws/global-infrastructure/";
    wrapper.appendChild(embedLink);
    const cells = [[wrapper]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-globe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-feedback.js
  function parse7(element, { document }) {
    const heading = element.querySelector("h2");
    const description = element.querySelector("p");
    const buttons = Array.from(element.querySelectorAll("button"));
    const buttonLabels = buttons.map((btn) => {
      const labelSpan = btn.querySelector("span");
      return labelSpan ? labelSpan.textContent.trim() : btn.textContent.trim();
    }).filter((text) => text.length > 0 && text.length < 20);
    const cellContent = [];
    const frag = document.createDocumentFragment();
    const embedLink = document.createElement("a");
    embedLink.href = "https://aws.amazon.com/#feedback-widget";
    const linkText = [];
    if (heading) {
      linkText.push(heading.textContent.trim());
    }
    if (description) {
      linkText.push(description.textContent.trim());
    }
    if (buttonLabels.length > 0) {
      linkText.push(`[${buttonLabels.join(" / ")}]`);
    }
    embedLink.textContent = embedLink.href;
    frag.appendChild(embedLink);
    cellContent.push(frag);
    const cells = [cellContent];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-feedback", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aws-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#awsccc-sb-ux-c"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#aws-page-skip-to-main"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        ".header.m-global-header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".footer.htlwrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#mrc-sunrise-chat"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-gradient": parse,
    "cards-editorial": parse2,
    "carousel-deluxe": parse3,
    "tabs-compass": parse4,
    "cards-industry": parse5,
    "embed-globe": parse6,
    "embed-feedback": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AWS homepage with hero, service cards, promotional sections, and call-to-action areas",
    urls: [
      "https://aws.amazon.com/"
    ],
    blocks: [
      {
        name: "hero-gradient",
        instances: ["#hero"]
      },
      {
        name: "cards-editorial",
        instances: ["#amsinteractive-card-verticalpattern-data-180524338"]
      },
      {
        name: "carousel-deluxe",
        instances: ["#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years"]
      },
      {
        name: "tabs-compass",
        instances: ["#compass-lite"]
      },
      {
        name: "cards-industry",
        instances: ["#amsinteractive-card-verticalpattern-data-590777913"]
      },
      {
        name: "embed-globe",
        instances: [".rgim_72884f5b"]
      },
      {
        name: "embed-feedback",
        instances: ["#did-you-find-what-you-were-looking-for-today"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "#hero",
        style: "accent",
        blocks: ["hero-gradient"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "What's New",
        selector: "#amsinteractive-card-verticalpattern-data-180524338",
        style: null,
        blocks: ["cards-editorial"],
        defaultContent: [
          "#amsinteractive-card-verticalpattern-data-180524338 h2",
          "#amsinteractive-card-verticalpattern-data-180524338 p.rgic_1671485e"
        ]
      },
      {
        id: "section-3",
        name: "Customer Stories Carousel",
        selector: "#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years",
        style: null,
        blocks: ["carousel-deluxe"],
        defaultContent: [
          "#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years h2",
          "#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years p"
        ]
      },
      {
        id: "section-4",
        name: "Customer Stories Compass",
        selector: ["#compass-lite"],
        style: null,
        blocks: ["tabs-compass"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Powering Industries",
        selector: "#amsinteractive-card-verticalpattern-data-590777913",
        style: null,
        blocks: ["cards-industry"],
        defaultContent: [
          "#amsinteractive-card-verticalpattern-data-590777913 h2",
          "#amsinteractive-card-verticalpattern-data-590777913 p.rgic_1671485e",
          "#amsinteractive-card-verticalpattern-data-590777913 a.rgic_2a7f98ee"
        ]
      },
      {
        id: "section-6",
        name: "AWS Global Infrastructure",
        selector: ".rgim_72884f5b",
        style: null,
        blocks: ["embed-globe"],
        defaultContent: [
          ".rgim_72884f5b h2",
          ".rgim_72884f5b h5"
        ]
      },
      {
        id: "section-7",
        name: "Try AWS Free Compass",
        selector: ["#compass-lite"],
        style: null,
        blocks: ["tabs-compass"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Feedback",
        selector: "#did-you-find-what-you-were-looking-for-today",
        style: "grey",
        blocks: ["embed-feedback"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function insertSectionBreaks(document, main) {
    const sections = PAGE_TEMPLATE.sections;
    if (!sections || sections.length < 2) return;
    const sectionElements = [];
    sections.forEach((section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        const el = main.querySelector(sel);
        if (el) {
          sectionElements.push({ element: el, style: section.style });
          break;
        }
      }
    });
    for (let i = 0; i < sectionElements.length; i++) {
      const { element, style } = sectionElements[i];
      if (i > 0) {
        const hr = document.createElement("hr");
        element.parentNode.insertBefore(hr, element);
      }
      if (style) {
        const table = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: [["style", style]]
        });
        if (element.nextSibling) {
          element.parentNode.insertBefore(table, element.nextSibling);
        } else {
          element.parentNode.appendChild(table);
        }
      }
    }
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      insertSectionBreaks(document, main);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
