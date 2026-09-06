# Redesign verification notes

## Design direction

This is a Redesign · Overhaul with protected data contracts. The attached DesignSystem.md is the source of truth for the visual layer: #292d32 background, #353a40 light shadow, #1d2024 dark shadow, #e0e5ec primary text, #9ca3af muted text, and #f97316 / #ea580c accent states. The existing report content, ViewState values, navigation labels, form field names, and localStorage key remain unchanged.

## Implemented interaction changes

The document navigation is now a single horizontal row on desktop/tablet and a fixed, horizontally scrollable bottom navigation on mobile. Project management is intentionally separated from document navigation: the folder button opens the Project Drawer, while the bottom row exposes document steps. The mobile drawer is no longer used for document navigation.

The Project Drawer remains backed by the existing `contractscan_projects_v4_cleanslate` localStorage key. New projects start as a blank project instead of receiving fabricated project name/contract number data. Selecting a project updates the active project and closes the drawer. Adding a project closes the drawer and keeps the new project isolated. Existing auto-save, manual save, JSON export/import, and delete-confirmation behavior remain available.

## Browser and render evidence

- Production build completed with `npm run lint` and `npm run build`.
- Desktop browser render at `http://127.0.0.1:4311` displayed the new horizontal document navigation and Project Drawer trigger.
- Project Drawer opened successfully, showed the original project, and after selecting Add Project showed two separate project records.
- The new record displayed `ยังไม่ได้ระบุโครงการ`, no fabricated contract number, and `สร้างใหม่` status.
- Mobile render at 390x844 was saved to `/home/ubuntu/screenshots/contractscan-mobile-redesign.png`. Bottom navigation is fixed above the safe-area, shows project/document actions, and content remains visible above it because the main layout has mobile bottom padding.
- Existing report content and page order remained visible in the browser extraction.

## Follow-up observation

The bundle warning remains approximately 757.6 kB minified / 204.3 kB gzip. It does not block the app, but document-level dynamic imports would be a reasonable follow-up performance task after this UX redesign is accepted.


## Persistence reload check

After a page reload, the Project Drawer still displayed two separate project records, confirming that the newly added project persisted under the existing localStorage key. The document navigation and original report fields remained available after reload.
