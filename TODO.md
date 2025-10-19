# TODO: Add Forgot Password Feature

- [ ] Update `database/schema.sql` to add `reset_token` and `reset_expires` columns to users table.
- [ ] Add `forgotPassword` and `resetPassword` functions to `server/controllers/authController.js`.
- [ ] Add POST routes `/forgot-password` and `/reset-password` to `server/routes/auth.js`.
- [ ] Create `client/src/pages/ForgotPassword.jsx` (similar to Login, with email input and submit).
- [ ] Create `client/src/pages/ResetPassword.jsx` (similar to Login/Register, with new password inputs, takes token from URL query).
- [ ] Update `client/src/App.jsx` to add routes for `/forgot-password` and `/reset-password`.
- [ ] Update `client/src/pages/Login.jsx` to make "Forgot password?" link navigate to `/forgot-password`.
- [ ] Update `client/src/pages/Register.jsx` to match Login's styling for consistency.
- [ ] Run database migration to apply schema changes.
- [ ] Test the forgot password flow.
