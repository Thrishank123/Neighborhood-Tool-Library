# TODO: Connect Styling for Reservations Page and Add Navigation Flow

- [x] Update form inputs to use "input" className
- [x] Update submit button to use "btn btn-primary" className
- [x] Change table className from "data-table" to "table"
- [x] Wrap form in a "card" div with margin bottom
- [x] Wrap table in a "card" div
- [x] Add container and padding classes to main div
- [x] Make form responsive with grid layout on medium screens
- [x] Make table responsive with horizontal scroll on small screens
- [x] Navigate to reservations page after successful reserve from tools page
- [x] Pre-populate tool_id in reservations form when navigated with query param

# TODO: Implement Tool Return Functionality

- [x] Add returnReservation function in server/controllers/reservationController.js to allow users to close their active reservations
- [x] Add PATCH /:id/return route in server/routes/reservations.js for authenticated users
- [x] Update client/src/pages/Reservations.jsx to show Return button for active reservations and handle return API call
- [x] Test the return functionality to ensure reservation status changes to 'closed' and tool becomes available
