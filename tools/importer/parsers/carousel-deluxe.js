/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-deluxe
 * Base block: carousel
 * Source: https://aws.amazon.com/
 * Selector: #from-startups-to-enterprisesaws-is-how-leaders-have-powered-innovation-for-20-years
 * Generated: 2026-06-03T16:52:00Z
 *
 * Extracts customer story carousel slides. Each slide has a full background image
 * and text content (category badge, company logo, heading, CTA link).
 *
 * UE Model (carousel-deluxe-item):
 *   - media_image (reference) + media_imageAlt (collapsed) => cell 0 (image)
 *   - content_text (richtext) => cell 1 (text content)
 */
export default function parse(element, { document }) {
  // Find carousel slide containers — each .rgca_d59560c1 is one slide
  const slideContainers = element.querySelectorAll('#carousel-items > .rgca_d59560c1, .rgca_f1665d34 > .rgca_d59560c1');
  const cells = [];

  slideContainers.forEach((slideContainer) => {
    // --- Cell 0: Background Image ---
    // Background image is in .rgca_2fcaa65b img (the large card background)
    const bgImg = slideContainer.querySelector('.rgca_2fcaa65b img');
    const imageCell = [];
    if (bgImg) {
      // Create field hint for media_image
      const imgClone = bgImg.cloneNode(true);
      // Ensure alt text is set (collapsed field media_imageAlt handled via img alt attribute)
      if (!imgClone.getAttribute('alt') || imgClone.getAttribute('alt') === '') {
        // Try to derive alt from the slide heading
        const slideHeading = slideContainer.querySelector('h2');
        if (slideHeading) {
          imgClone.setAttribute('alt', slideHeading.textContent.trim());
        }
      }
      imageCell.push(imgClone);
    }

    // --- Cell 1: Content (richtext) ---
    // Contains: category badge, company logo, heading, CTA link
    const contentCell = [];

    // Category badge (e.g., "Advertising & Marketing", "Automotive")
    const categoryBadge = slideContainer.querySelector('.rgca_d54eb7cb span[class*="rgca_beb26dc7"]');
    if (categoryBadge) {
      const p = document.createElement('p');
      p.textContent = categoryBadge.textContent.trim();
      contentCell.push(p);
    }

    // Company logo image
    const logoImg = slideContainer.querySelector('img.rgca_8e9ae6ea');
    if (logoImg) {
      const logoClone = logoImg.cloneNode(true);
      contentCell.push(logoClone);
    }

    // Heading (h2 inside the content area)
    const heading = slideContainer.querySelector('.rgca_3c998476 h2, .rgca_5e6ec02e h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }

    // CTA link — the entire card is wrapped in an anchor
    const cardLink = slideContainer.querySelector('a.group-hover, a[class*="rgca_fc949a28"]');
    if (cardLink) {
      const ctaTextEl = slideContainer.querySelector('.rgca_4af30717 span, .rgca_02e87eb9 span[class*="rgca_82d7eac3"]');
      const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : 'View the story';
      const a = document.createElement('a');
      a.href = cardLink.href;
      a.textContent = ctaText;
      contentCell.push(a);
    }

    // Add slide row: [image, content]
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-deluxe', cells });
  element.replaceWith(block);
}
