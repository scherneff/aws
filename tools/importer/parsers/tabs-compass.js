/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-compass
 * Base block: tabs
 * Source: https://aws.amazon.com/
 * Selector: #compass-lite
 * Generated: 2026-06-03
 *
 * Extracts an interactive compass/dropdown filter component into a tabs-compass block.
 * The source renders one tab's content at a time (the selected dropdown option).
 * Each tab item row has: [title] | [content_heading + content_image + content_richtext]
 *
 * UE Model fields per item:
 *   - title (tab title - the dropdown option label)
 *   - content_heading (card heading)
 *   - content_headingType (collapsed - skip)
 *   - content_image (card image)
 *   - content_richtext (card description + link)
 *
 * Note: #compass-lite appears twice on the page (sections 4 and 7).
 * Section 4: "I want to see new customer stories in [industry]" with image cards
 * Section 7: "I want to [action]" with text-only cards
 * Parser handles both variants.
 */
export default function parse(element, { document }) {
  // Extract the currently selected dropdown/tab title from the compass selector
  // The dropdown value is inside a span within the compass_e8457524 container
  const dropdownSpan = element.querySelector('.compass_e8457524 > span');
  const dropdownLabel = dropdownSpan || element.querySelector('.compass_6ffdde71 span:first-child');
  const tabTitle = dropdownLabel ? dropdownLabel.textContent.trim() : 'Default';

  // Find all card containers - each card is wrapped in an anchor with class compass_f64fcab2
  const cardLinks = Array.from(element.querySelectorAll('a.compass_f64fcab2'));

  // Build content cell - all cards for this tab go into one content cell
  const contentCell = document.createDocumentFragment();

  if (cardLinks.length > 0) {
    cardLinks.forEach((cardLink, idx) => {
      // Extract card image (may not exist in text-only variant section 7)
      const cardImage = cardLink.querySelector('img.compass_8e9ae6ea');

      // Extract card heading (h3, h4, or h5)
      const cardHeading = cardLink.querySelector('h3, h4, h5');

      // Extract card description text
      const cardDesc = cardLink.querySelector('[class*="compass_98b54368"], [class*="compass_3a1f8f93"]');

      // Extract CTA text from the link label area
      const ctaText = cardLink.querySelector('[class*="compass_82d7eac3"], [class*="compass_4af30717"] span');

      if (idx === 0) {
        // First card: apply field hints for UE model fields

        // content_heading field hint
        if (cardHeading) {
          const h3 = document.createElement('h3');
          h3.textContent = cardHeading.textContent.trim();
          contentCell.appendChild(h3);
        }

        // content_image field hint (only if image exists and is not a data URI icon)
        if (cardImage && !cardImage.src.startsWith('data:')) {
          const img = document.createElement('img');
          img.src = cardImage.src;
          img.alt = cardImage.alt || '';
          contentCell.appendChild(img);
        }

        // content_richtext field hint - description + CTA link
        if (cardDesc) {
          const p = document.createElement('p');
          p.textContent = cardDesc.textContent.trim();
          contentCell.appendChild(p);
        }
        if (ctaText && cardLink.href) {
          const link = document.createElement('a');
          link.href = cardLink.href;
          link.textContent = ctaText.textContent.trim();
          contentCell.appendChild(link);
        }
      } else {
        // Additional cards: append to richtext area (multi-card tabs)
        if (cardHeading) {
          const h3 = document.createElement('h3');
          h3.textContent = cardHeading.textContent.trim();
          contentCell.appendChild(h3);
        }
        if (cardImage && !cardImage.src.startsWith('data:')) {
          const img = document.createElement('img');
          img.src = cardImage.src;
          img.alt = cardImage.alt || '';
          contentCell.appendChild(img);
        }
        if (cardDesc) {
          const p = document.createElement('p');
          p.textContent = cardDesc.textContent.trim();
          contentCell.appendChild(p);
        }
        if (ctaText && cardLink.href) {
          const link = document.createElement('a');
          link.href = cardLink.href;
          link.textContent = ctaText.textContent.trim();
          contentCell.appendChild(link);
        }
      }
    });
  } else {
    // Fallback: no card links found (text-only variant or different structure)
    // Try to extract content from generic panel containers
    const panels = Array.from(element.querySelectorAll('[class*="compass_12089782"] [class*="compass_b31c11ca"]'));
    if (panels.length > 0) {
      panels.forEach((panel) => {
        const headings = panel.querySelectorAll('h2, h3, h4, h5');
        const descriptions = panel.querySelectorAll('span[class*="compass_98b54368"]');
        const links = panel.querySelectorAll('a[href]:not([href^="data:"])');
        headings.forEach((h) => {
          const el = document.createElement('h3');
          el.textContent = h.textContent.trim();
          contentCell.appendChild(el);
        });
        descriptions.forEach((d) => {
          const el = document.createElement('p');
          el.textContent = d.textContent.trim();
          if (el.textContent) contentCell.appendChild(el);
        });
        links.forEach((a) => {
          if (a.href) {
            const el = document.createElement('a');
            el.href = a.href;
            el.textContent = a.textContent.trim() || 'Learn more';
            contentCell.appendChild(el);
          }
        });
      });
    }
  }

  // Build title cell with field hint
  const titleCell = document.createDocumentFragment();
  const titleEl = document.createElement('p');
  titleEl.textContent = tabTitle;
  titleCell.appendChild(titleEl);

  // Build cells: container block pattern - one row per tab
  // Row = [title cell, content cell]
  const cells = [
    [titleCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-compass', cells });
  element.replaceWith(block);
}
