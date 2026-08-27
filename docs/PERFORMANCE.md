# Performance

## Strategy

The project remains framework-free to keep JavaScript and runtime overhead controlled. Critical hero imagery is preloaded, below-the-fold images use lazy loading, and explicit dimensions reduce layout shift.

## PWA cache

The service worker separates core and runtime caches, restricts caching to same-origin resources, removes obsolete cache versions, and bounds runtime growth.

## Release checks

- Keep the hero asset optimized because it is an LCP candidate.
- Avoid unnecessary font weights and scripts.
- Preserve image dimensions/aspect ratios.
- Re-run local audits after asset renames or cache changes.


## v1.8 image delivery
The four primary food photographs now include WebP alternatives. Static editorial images keep JPEG fallbacks through `<picture>`, while dynamic menu cards use the smaller WebP files directly. The hero WebP is preloaded and receives `fetchpriority="high"`.


## v2.2 responsive media

- Every product now has a 384 px WebP derivative for compact mobile cards and Rosa recommendation cards.
- The hero has a dedicated 640 px WebP source for viewports up to 48rem.
- Dynamic product cards expose `srcset` and `sizes` so mobile devices are not forced to fetch the larger source when a smaller candidate is sufficient.
