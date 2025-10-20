# UI Improvements Task

## Improve Typographic Hierarchy
- [ ] Update NavBar.jsx: Apply bold font weight to desktop navigation links
- [ ] Update card headers (h2/h3) across all pages: Increase font size, apply bold weight, make responsive
  - [ ] AdminPanel.jsx: h2 and h3 elements
  - [ ] Login.jsx: h2 elements
  - [ ] Register.jsx: h2 elements
  - [ ] Reports.jsx: h2 elements
  - [ ] Reservations.jsx: h2 and h3 elements
  - [ ] Reviews.jsx: h2 elements
  - [ ] ToolCard.jsx: h3 elements
  - [ ] Modal.jsx: h3 elements

## Overhaul Mobile Navigation Menu
- [ ] Update NavBar.jsx: Replace glassmorphism with opaque white background, use black text for links, fix logout button visibility

## Redesign "Add New Tool" Button
- [ ] Update NavBar.jsx: Style as filled, pill-shaped button with contrasting solid background

## Testing
- [ ] Test responsiveness on different screen sizes
- [ ] Verify text visibility and contrast
- [ ] Check mobile menu functionality and logout button accessibility

# TODO: Implement Tool Return Functionality

- [x] Add returnReservation function in server/controllers/reservationController.js to allow users to close their active reservations
- [x] Add PATCH /:id/return route in server/routes/reservations.js for authenticated users
- [x] Update client/src/pages/Reservations.jsx to show Return button for active reservations and handle return API call
- [ ] Test the return functionality to ensure reservation status changes to 'closed' and tool becomes available
