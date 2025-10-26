# TODO: Implement Ownership Rules for Reservations and Admin Features

## Backend Changes
- [x] Modify `getAllTools` in `server/controllers/toolController.js` to include `admin_id` in the SELECT query
- [x] Update `createReservation` in `server/controllers/reservationController.js` to check if the requesting user is the tool's admin before allowing reservation
- [x] Update `getPendingReservations` in `server/controllers/reservationController.js` to filter reservations to only show those for tools managed by the logged-in admin

## Frontend Changes
- [x] Modify `ToolCard.jsx` to receive a `user` prop and disable the Reserve button if the user is an admin who owns the tool, with a visual indicator
- [x] Update `Tools.jsx` to import `useAuth` and pass the user to each `ToolCard`

## Security Enhancements
- [x] Restrict tool deletion to owner in `deleteTool` function
- [x] Restrict reservation status updates to tool owner in `updateReservationStatus` function

## Testing
- [ ] Test reservation creation as admin for own tools (should fail with 403 Forbidden)
- [ ] Test reservation creation as admin for others' tools (should succeed)
- [ ] Test pending reservations view for admins (should only show relevant requests)
- [ ] Verify frontend disables Reserve button appropriately for admin-owned tools
- [ ] Test tool deletion by non-owner admin (should fail with 403 Forbidden)
- [ ] Test reservation approval/rejection by non-owner admin (should fail with 403 Forbidden)
