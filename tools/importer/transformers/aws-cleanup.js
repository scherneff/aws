/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AWS site-wide cleanup.
 * Removes non-authorable content (cookie consent, header, footer, nav, tracking, chat widget).
 * Selectors verified from migration-work/cleaned.html.
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Cookie consent banner and modals (blocks parsing if present)
    // Found: <div id="awsccc-sb-ux-c"> containing cookie banner, settings modal, and CCBA modal
    WebImporter.DOMUtils.remove(element, [
      '#awsccc-sb-ux-c',
    ]);

    // Skip-to-main link (non-authorable accessibility chrome)
    // Found: <a class="m-sr-only m-sr-only-focusable m-skip-el" id="aws-page-skip-to-main">
    WebImporter.DOMUtils.remove(element, [
      '#aws-page-skip-to-main',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Header/navigation (site shell - non-authorable)
    // Found: <div class="header htlwrapper m-global-header">
    WebImporter.DOMUtils.remove(element, [
      '.header.m-global-header',
    ]);

    // Footer (site shell - non-authorable)
    // Found: <div class="footer htlwrapper">
    WebImporter.DOMUtils.remove(element, [
      '.footer.htlwrapper',
    ]);

    // Chat widget (non-authorable)
    // Found: <div id="mrc-sunrise-chat">
    WebImporter.DOMUtils.remove(element, [
      '#mrc-sunrise-chat',
    ]);

    // Adobe tracking iframe (non-authorable)
    // Found: <iframe id="destination_publishing_iframe_aws_0" src="https://aws.demdex.net/...">
    WebImporter.DOMUtils.remove(element, [
      'iframe',
    ]);

    // Stray link elements and noscript tags
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
    ]);
  }
}
