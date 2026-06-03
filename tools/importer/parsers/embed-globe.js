/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-globe variant.
 * Base block: embed
 * Source: https://aws.amazon.com/
 * Selector: .rgim_72884f5b
 * Generated: 2026-06-03
 *
 * Extracts the AWS Global Infrastructure interactive 3D globe widget.
 * The source contains a WebGL canvas with regional tab navigation
 * (North America, South America, Europe, Middle East, Africa, Asia Pacific,
 * Australia and New Zealand). Since this is a complex interactive component
 * that cannot be authored as standard content, the parser extracts the
 * heading, description, and region labels, then creates an embed block
 * referencing the AWS infrastructure page.
 */
export default function parse(element, { document }) {
  // Extract heading (h2) - validated against source.html: h2.rgim_8711ccd9
  const heading = element.querySelector('h2');

  // Extract description (h5 used as subtitle) - validated against source.html: h5.rgim_8711ccd9
  const description = element.querySelector('h5');

  // Extract region tab labels from button spans - validated against source.html:
  // ul > li > button > span pattern with class rgim_5e58a6df
  const regionButtons = Array.from(element.querySelectorAll('ul li button span'));
  const regions = regionButtons
    .map((span) => span.textContent.trim())
    .filter((text) => text.length > 0);

  // Build a single content cell containing heading, description, regions, and embed link.
  // All content goes in one cell (one column) since embed blocks have simple structure.
  const wrapper = document.createElement('div');

  if (heading) {
    wrapper.appendChild(heading);
  }

  if (description) {
    wrapper.appendChild(description);
  }

  // Add a paragraph listing the regions for reference
  if (regions.length > 0) {
    const regionsP = document.createElement('p');
    regionsP.textContent = `Regions: ${regions.join(', ')}`;
    wrapper.appendChild(regionsP);
  }

  // Add link to AWS infrastructure page as the embed source
  const embedLink = document.createElement('a');
  embedLink.href = 'https://aws.amazon.com/about-aws/global-infrastructure/';
  embedLink.textContent = 'https://aws.amazon.com/about-aws/global-infrastructure/';
  wrapper.appendChild(embedLink);

  const cells = [[wrapper]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-globe', cells });
  element.replaceWith(block);
}
