# Frontend Update Plan for Neighborhood Tool Library

## 1. Configuration Updates
- [ ] Update `client/tailwind.config.js` with 8px spacing system, typography scale, and neutral palette refinements
- [ ] Update `client/src/index.css` with base styles, focus styles, button overrides, and accessibility utilities

## 2. Create Reusable Components
- [ ] Create `client/src/components/Button.jsx` (styled button with variants)
- [ ] Create `client/src/components/FormInput.jsx` (input with label, error, ARIA)
- [ ] Create `client/src/components/Card.jsx` (responsive card)
- [ ] Create `client/src/components/Table.jsx` (accessible table)
- [ ] Create `client/src/components/Toast.jsx` (notification system)
- [ ] Create `client/src/components/Modal.jsx` (overlay modal)
- [ ] Create `client/src/components/Spinner.jsx` (loading indicator)
- [ ] Create `client/src/components/Container.jsx` (max-width wrapper)

## 3. Update Existing Components
- [ ] Update `client/src/components/Navbar.jsx` (collapsible off-canvas sidebar, ARIA, focus styles, responsive)
- [ ] Update `client/src/pages/Login.jsx` (centered form, labels, validation, ARIA, focus styles)
- [ ] Update `client/src/pages/Register.jsx` (match Login styling, role selection, validation)
- [ ] Update `client/src/pages/Tools.jsx` (loading spinner, skeleton cards, responsive grid)
- [ ] Update `client/src/components/ToolCard.jsx` (reserve button, accessibility, responsive)
- [ ] Update `client/src/pages/Reservations.jsx` (styled form/table, loading/toasts)
- [ ] Update `client/src/pages/Reports.jsx` (styled form/table, toasts)
- [ ] Update `client/src/pages/Reviews.jsx` (styled form/reviews, toasts/loading)
- [ ] Update `client/src/pages/AdminPanel.jsx` (styled sections/tables, confirm modals, toasts)

## 4. Integration and Testing
- [ ] Integrate Toast component across forms for success/error notifications
- [ ] Test responsiveness on mobile/tablet/desktop
- [ ] Verify accessibility (screen readers, keyboard navigation)
- [ ] Run app and check login/register, protected routes, tools actions
- [ ] Capture screenshots of Login and Tools pages across devices
