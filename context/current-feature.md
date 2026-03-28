# Current Feature

## Status
Not Started

## Goals
<!-- Add feature goals here -->

## Notes
<!-- Add context or implementation notes here -->

## History

- **Forgot Password**: Added forgot password capabilities reusing the VerificationToken model securely with a suffix to prevent cross-authentication bugs. Implemented `(auth)/forgot-password` to email tokens via Resend, and `(auth)/reset-password` to securely validate and set new passwords.
