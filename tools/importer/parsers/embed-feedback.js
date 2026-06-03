/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-feedback
 * Base block: embed
 * Source: https://aws.amazon.com/
 * Selector: #did-you-find-what-you-were-looking-for-today
 * Generated: 2026-06-03
 *
 * Extracts the AWS feedback widget (heading, subtitle, Yes/No buttons).
 * Since this is an interactive inline widget with no external embed URL
 * in the source, the parser constructs a reference link for the embed block.
 *
 * UE Model fields (from _embed-feedback.json):
 *   - embed_placeholder (reference): Optional placeholder image
 *   - embed_placeholderAlt (collapsed - skip)
 *   - embed_uri (text): URI for the embedded content
 *
 * Fields share prefix "embed_" -> grouped into one row/cell.
 *
 * Source selectors (validated against source.html):
 *   - h2 heading (class rgfe_8711ccd9): "Did you find what you were looking for today?"
 *   - p paragraph (class rgfe_8711ccd9): subtitle description
 *   - button elements (class rgfe_9e423fbb): Yes/No feedback buttons
 *   - button > span (class rgfe_5e58a6df): button label text
 */
export default function parse(element, { document }) {
  // Extract heading (h2) - validated: h2.rgfe_8711ccd9.rgfe_7047aa37.rgfe_b033b5e8
  const heading = element.querySelector('h2');

  // Extract subtitle paragraph - validated: p.rgfe_8711ccd9.rgfe_98b54368
  const description = element.querySelector('p');

  // Extract button labels - validated: button.rgfe_9e423fbb > span.rgfe_5e58a6df
  const buttons = Array.from(element.querySelectorAll('button'));
  const buttonLabels = buttons
    .map((btn) => {
      const labelSpan = btn.querySelector('span');
      return labelSpan ? labelSpan.textContent.trim() : btn.textContent.trim();
    })
    .filter((text) => text.length > 0 && text.length < 20);

  // Build the embed cell content
  // The embed block expects a link (and optionally a picture placeholder).
  // Since the source is an inline widget with no external URI, we construct
  // a reference link that includes context about the widget's content.
  const cellContent = [];

  // Field hint for embed_placeholder - no image available in source, skip content
  // Field hint for embed_uri - construct a link for the feedback widget
  const frag = document.createDocumentFragment();

  // Create a link element as the embed URI reference
  // Include heading and button labels as context for the feedback widget
  const embedLink = document.createElement('a');
  embedLink.href = 'https://aws.amazon.com/#feedback-widget';
  const linkText = [];
  if (heading) {
    linkText.push(heading.textContent.trim());
  }
  if (description) {
    linkText.push(description.textContent.trim());
  }
  if (buttonLabels.length > 0) {
    linkText.push(`[${buttonLabels.join(' / ')}]`);
  }
  embedLink.textContent = embedLink.href;
  frag.appendChild(embedLink);

  cellContent.push(frag);

  // Single row with grouped embed_ fields (embed_placeholder is empty, embed_uri has the link)
  const cells = [cellContent];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-feedback', cells });
  element.replaceWith(block);
}
