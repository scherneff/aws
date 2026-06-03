# AWS Homepage Migration Plan

## Overview

Migrate the AWS homepage (https://aws.amazon.com/) to AEM Edge Delivery Services. This is a complex page with multiple sections, navigation, hero areas, product/service cards, and promotional content.

## Source

- **URL**: https://aws.amazon.com/
- **Type**: Single page migration

## Approach

Use the `excat:excat-site-migration` skill workflow for a single-page migration:

1. **Scrape & Analyze** — Fetch the page, extract content, metadata, and images
2. **Page Analysis** — Identify sections, blocks, and content structure
3. **Block Mapping** — Map source page elements to available EDS blocks (or create new variants)
4. **Import Infrastructure** — Generate parsers and transformers for content import
5. **Content Import** — Execute the import to produce structured HTML
6. **Design Migration** — Extract and apply visual styles (CSS) from the original
7. **Preview & Validate** — Verify the migrated page renders correctly locally

## Considerations

- The AWS homepage is content-heavy with dynamic elements, complex navigation (mega-menu), and multiple promotional sections
- Navigation and footer will need dedicated orchestration (nav/footer skills)
- Some interactive/dynamic content (carousels, tabs, animated elements) may need custom block development
- Images and icons will need to be downloaded and referenced locally
- The page likely uses JavaScript-rendered content that may require careful scraping

## Checklist

- [ ] Scrape the AWS homepage and download assets (images, icons)
- [ ] Analyze page structure — identify sections, blocks, and content sequences
- [ ] Survey available blocks in the project and block collection
- [ ] Map page elements to EDS blocks (existing or new variants)
- [ ] Generate import infrastructure (parsers + transformers)
- [ ] Execute content import to produce structured HTML
- [ ] Migrate navigation (header/mega-menu) using navigation orchestrator
- [ ] Migrate footer using footer orchestrator
- [ ] Extract and apply site design tokens (colors, typography, spacing)
- [ ] Apply block-level CSS styling to match original design
- [ ] Preview migrated page locally and validate rendering
- [ ] Compare migrated page against original for visual fidelity
- [ ] Fix any rendering issues or style discrepancies

## Execution

This plan requires **Execute mode** to proceed with implementation. The primary skill to invoke is `excat:excat-site-migration` for single-page migration, which will coordinate the sub-steps automatically.
