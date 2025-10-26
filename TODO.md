# Refactor Tailwind CSS Classes for Smaller UI

## Overview
Systematically reduce Tailwind CSS classes across the frontend to make the interface less oversized and more balanced, especially on larger screens, while maintaining readability and responsiveness.

## Key Changes
- **Typography**: Reduce heading sizes (text-4xl → text-3xl, text-3xl → text-2xl, etc.)
- **Spacing**: Reduce padding (p-8 → p-6, p-12 → p-8), margins (mb-12 → mb-8, my-8 → my-6), gaps (gap-8 → gap-6)
- **Components**: Reduce button padding (py-3 px-6 → py-2 px-4), input padding (py-3 → py-2)
- **Navbar**: Reduce height and padding
- **Consistency**: Apply changes uniformly across all pages

## Files to Edit
- [ ] client/src/components/Navbar.jsx - Reduce navbar height, padding, font sizes
- [ ] client/src/components/ToolCard.jsx - Reduce heading size, spacing
- [ ] client/src/pages/Tools.jsx - Reduce headings, container padding, grid gaps
- [ ] client/src/pages/AdminPanel.jsx - Reduce headings, table padding, modal sizes
- [ ] client/src/pages/Reservations.jsx - Reduce headings, form padding, table padding
- [ ] client/src/pages/Login.jsx - Reduce headings, icon sizes, form spacing
- [ ] client/src/pages/Register.jsx - Reduce headings, icon sizes, form spacing
- [ ] client/src/components/Button.jsx - Reduce default padding
- [ ] client/src/components/FormInput.jsx - Reduce input padding
- [ ] client/src/components/Card.jsx - Reduce default padding
- [ ] client/src/index.css - Update base component styles

## Responsiveness Check
- [ ] Test on mobile, tablet, desktop
- [ ] Adjust responsive prefixes (md:, lg:) as needed
- [ ] Ensure no overlapping text or awkward wrapping

## Validation
- [ ] All changes applied consistently
- [ ] Readability maintained
- [ ] Responsiveness intact
