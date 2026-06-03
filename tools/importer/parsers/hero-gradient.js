/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-gradient
 * Base block: hero
 * Source: https://aws.amazon.com/
 * Generated: 2026-06-03
 *
 * UE Model fields:
 *   - image (reference): Decorative hero image
 *   - imageAlt (collapsed into image alt attribute)
 *   - text (richtext): Heading + paragraph + CTA button
 *
 * Source selectors (validated against #hero source.html):
 *   - h1 heading (class rghr_8711ccd9)
 *   - p paragraph description (class rghr_1671485e)
 *   - a[href] CTA button link (class rghr_9e423fbb)
 *   - img decorative image (class rghr_c0aab36e)
 */
export default function parse(element, { document }) {
  // Extract heading (h1 primary, fallback to h2/h3)
  const heading = element.querySelector('h1, h2, h3');

  // Extract description paragraph (first p not inside a link)
  const description = element.querySelector('p');

  // Extract CTA link (primary button/link)
  const ctaLink = element.querySelector('a[href]');

  // Extract decorative image
  const image = element.querySelector('img');

  // --- Row 1: Image field ---
  const imageCell = [];
  if (image) {
    const frag = document.createDocumentFragment();
    frag.appendChild(image);
    imageCell.push(frag);
  }

  // --- Row 2: Text field (richtext with heading + paragraph + CTA) ---
  const textCell = [];
  const textFrag = document.createDocumentFragment();

  if (heading) {
    textFrag.appendChild(heading);
  }
  if (description) {
    textFrag.appendChild(description);
  }
  if (ctaLink) {
    // Wrap CTA in p > strong > a for proper button formatting in richtext
    const ctaParagraph = document.createElement('p');
    const strong = document.createElement('strong');
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent.trim();
    strong.appendChild(link);
    ctaParagraph.appendChild(strong);
    textFrag.appendChild(ctaParagraph);
  }
  textCell.push(textFrag);

  // Build cells array matching UE model (simple block: 1 col, fields as rows)
  const cells = [];
  if (imageCell.length > 0) {
    cells.push(imageCell);
  }
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gradient', cells });
  element.replaceWith(block);
}
