/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-industry
 * Base block: cards
 * Source: https://aws.amazon.com/
 * Selector: #amsinteractive-card-verticalpattern-data-590777913
 * Generated: 2026-06-03
 *
 * Container block: each card = one row with columns [image, text]
 * UE model fields per card item: image (reference), text (richtext)
 *
 * Source DOM structure (validated against source.html):
 *   - Cards grid container: div.rgic_0f10b411
 *   - Card wrapper: div.rgic_c9184425 > div.group-hover > a.rgic_f64fcab2
 *   - Card image: img.rgic_8e9ae6ea (inside div.rgic_13d689c0)
 *   - Card heading: h4.rgic_7047aa37
 *   - Card description: span.rgic_3a1f8f93
 *   - Card CTA text: span.rgic_82d7eac3 ("View industry")
 */
export default function parse(element, { document }) {
  // Locate the cards grid container, then find individual card items
  const gridContainer = element.querySelector('.rgic_0f10b411');
  const container = gridContainer || element;

  // Each card wrapper contains the clickable card with image and text
  const cardWrappers = container.querySelectorAll('.rgic_c9184425');

  const cells = [];

  cardWrappers.forEach((cardWrapper) => {
    // The entire card is wrapped in an anchor tag
    const link = cardWrapper.querySelector('a.rgic_f64fcab2');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // --- Image cell with field hint ---
    const img = cardWrapper.querySelector('img.rgic_8e9ae6ea');
    const imageFrag = document.createDocumentFragment();
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', img.getAttribute('src') || '');
      imgEl.setAttribute('alt', img.getAttribute('alt') || '');
      picture.appendChild(imgEl);
      imageFrag.appendChild(picture);
    }

    // --- Text cell with field hint (richtext: heading + description + CTA link) ---
    const heading = cardWrapper.querySelector('h4.rgic_7047aa37, h4');
    const description = cardWrapper.querySelector('span.rgic_3a1f8f93');
    const ctaText = cardWrapper.querySelector('span.rgic_82d7eac3');

    const textFrag = document.createDocumentFragment();

    if (heading) {
      const h4 = document.createElement('h4');
      h4.textContent = heading.textContent.trim();
      textFrag.appendChild(h4);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }

    // CTA link uses the card's anchor href and the "View industry" label text
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = ctaText ? ctaText.textContent.trim() : 'View industry';
      textFrag.appendChild(a);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-industry', cells });
  element.replaceWith(block);
}
