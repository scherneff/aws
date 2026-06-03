/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGradientParser from './parsers/hero-gradient.js';
import cardsEditorialParser from './parsers/cards-editorial.js';
import carouselDeluxeParser from './parsers/carousel-deluxe.js';
import tabsCompassParser from './parsers/tabs-compass.js';
import cardsIndustryParser from './parsers/cards-industry.js';
import embedGlobeParser from './parsers/embed-globe.js';
import embedFeedbackParser from './parsers/embed-feedback.js';

// TRANSFORMER IMPORTS
import awsCleanupTransformer from './transformers/aws-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-gradient': heroGradientParser,
  'cards-editorial': cardsEditorialParser,
  'carousel-deluxe': carouselDeluxeParser,
  'tabs-compass': tabsCompassParser,
  'cards-industry': cardsIndustryParser,
  'embed-globe': embedGlobeParser,
  'embed-feedback': embedFeedbackParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  awsCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AWS homepage with hero, service cards, promotional sections, and call-to-action areas',
  urls: [
    'https://aws.amazon.com/'
  ],
  blocks: [
    {
      name: 'hero-gradient',
      instances: ['#hero']
    },
    {
      name: 'cards-editorial',
      instances: ['#amsinteractive-card-verticalpattern-data-180524338']
    },
    {
      name: 'carousel-deluxe',
      instances: ['#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years']
    },
    {
      name: 'tabs-compass',
      instances: ['#compass-lite']
    },
    {
      name: 'cards-industry',
      instances: ['#amsinteractive-card-verticalpattern-data-590777913']
    },
    {
      name: 'embed-globe',
      instances: ['.rgim_72884f5b']
    },
    {
      name: 'embed-feedback',
      instances: ['#did-you-find-what-you-were-looking-for-today']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '#hero',
      style: 'accent',
      blocks: ['hero-gradient'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: "What's New",
      selector: '#amsinteractive-card-verticalpattern-data-180524338',
      style: null,
      blocks: ['cards-editorial'],
      defaultContent: [
        '#amsinteractive-card-verticalpattern-data-180524338 h2',
        '#amsinteractive-card-verticalpattern-data-180524338 p.rgic_1671485e'
      ]
    },
    {
      id: 'section-3',
      name: 'Customer Stories Carousel',
      selector: '#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years',
      style: null,
      blocks: ['carousel-deluxe'],
      defaultContent: [
        '#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years h2',
        '#from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years p'
      ]
    },
    {
      id: 'section-4',
      name: 'Customer Stories Compass',
      selector: ['#compass-lite'],
      style: null,
      blocks: ['tabs-compass'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Powering Industries',
      selector: '#amsinteractive-card-verticalpattern-data-590777913',
      style: null,
      blocks: ['cards-industry'],
      defaultContent: [
        '#amsinteractive-card-verticalpattern-data-590777913 h2',
        '#amsinteractive-card-verticalpattern-data-590777913 p.rgic_1671485e',
        '#amsinteractive-card-verticalpattern-data-590777913 a.rgic_2a7f98ee'
      ]
    },
    {
      id: 'section-6',
      name: 'AWS Global Infrastructure',
      selector: '.rgim_72884f5b',
      style: null,
      blocks: ['embed-globe'],
      defaultContent: [
        '.rgim_72884f5b h2',
        '.rgim_72884f5b h5'
      ]
    },
    {
      id: 'section-7',
      name: 'Try AWS Free Compass',
      selector: ['#compass-lite'],
      style: null,
      blocks: ['tabs-compass'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Feedback',
      selector: '#did-you-find-what-you-were-looking-for-today',
      style: 'grey',
      blocks: ['embed-feedback'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Insert section breaks (<hr>) between sections and add section-metadata blocks
 */
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
      const hr = document.createElement('hr');
      element.parentNode.insertBefore(hr, element);
    }

    if (style) {
      const table = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: [['style', style]],
      });
      if (element.nextSibling) {
        element.parentNode.insertBefore(table, element.nextSibling);
      } else {
        element.parentNode.appendChild(table);
      }
    }
  }
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Insert section breaks and section-metadata blocks
    insertSectionBreaks(document, main);

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
