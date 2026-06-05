/**
 * Embed Globe Block
 * Displays the AWS Global Infrastructure content section
 * with heading, subtitle, region list, and link.
 */
export default function decorate(block) {
  // The block content is purely informational — heading, subtitle, regions, link.
  // Structure: single row > single cell with h2, h5, p (regions), p > a (link)
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cell = row.querySelector(':scope > div');
  if (!cell) return;

  // Unwrap: move cell contents directly into block for simpler styling
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-globe-content';
  wrapper.append(...cell.childNodes);
  block.append(wrapper);

  // Style the link as a plain text link (not a button)
  const links = wrapper.querySelectorAll('a');
  links.forEach((link) => {
    const container = link.closest('.button-container');
    if (container) {
      // Remove button-container wrapper, keep the link
      link.classList.remove('button', 'primary', 'secondary');
      container.replaceWith(link);
    } else {
      link.classList.remove('button', 'primary', 'secondary');
    }
  });
}
