/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-editorial
 * Base block: cards
 * Source: https://aws.amazon.com/
 * Selector: #amsinteractive-card-verticalpattern-data-180524338
 * Generated: 2026-06-03
 * Validated: produces correct table with 3 card rows (image | text) per UE model
 *
 * UE Model: container block with "card" items
 * Each card row has 2 columns: image | text (richtext with badge, heading, description, link)
 *
 * Source structure: 3 vertical cards in a grid, each wrapped in an anchor tag
 * with image+badge on top and heading+description+CTA text below.
 */
export default function parse(element, { document }) {
  // Find the card container - the div holding the repeating card items
  const cardContainer = element.querySelector('.rgic_0f10b411');
  const container = cardContainer || element;

  // Select individual card wrappers - each card is in a div with these classes
  const cardWrappers = container.querySelectorAll(':scope > .rgic_7ca45506.rgic_c79807e3');

  // Fallback: if direct children don't match, try deeper selection
  const cards = cardWrappers.length > 0
    ? cardWrappers
    : element.querySelectorAll('.rgic_c9184425');

  const cells = [];

  cards.forEach((card) => {
    // --- Image cell ---
    const img = card.querySelector('img.rgic_8e9ae6ea');
    const imageFrag = document.createDocumentFragment();
    if (img) {
      // Clone image to avoid moving it from source
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      picture.appendChild(imgEl);
      imageFrag.appendChild(picture);
    }

    // --- Text cell (richtext: badge + heading + description + link) ---
    const textFrag = document.createDocumentFragment();

    // Badge/category tag
    const badge = card.querySelector('span.rgic_beb26dc7');
    if (badge) {
      const badgeEl = document.createElement('p');
      badgeEl.textContent = badge.textContent.trim();
      badgeEl.setAttribute('class', 'badge');
      textFrag.appendChild(badgeEl);
    }

    // Heading
    const heading = card.querySelector('h4.rgic_7047aa37, h3, h2');
    if (heading) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      textFrag.appendChild(h);
    }

    // Description
    const description = card.querySelector('span.rgic_98b54368, .rgic_b31c11ca span[class*="rgic_3a1f8f93"]');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }

    // CTA link - the card's wrapping anchor provides the href
    const cardLink = card.querySelector('a.rgic_f64fcab2');
    const ctaText = card.querySelector('span.rgic_82d7eac3');
    if (cardLink && ctaText) {
      const a = document.createElement('a');
      a.href = cardLink.href;
      a.textContent = ctaText.textContent.trim();
      textFrag.appendChild(a);
    } else if (cardLink) {
      // Fallback: use heading text as link text
      const a = document.createElement('a');
      a.href = cardLink.href;
      a.textContent = heading ? heading.textContent.trim() : 'Learn more';
      textFrag.appendChild(a);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-editorial', cells });
  element.replaceWith(block);
}
