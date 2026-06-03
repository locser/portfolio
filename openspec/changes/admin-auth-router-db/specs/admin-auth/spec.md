## ADDED Requirements

### Requirement: Authenticate Administrator
The system SHALL verify the administrator username and password against a predefined hashed value.

#### Scenario: Successful Administrator Login
- **WHEN** the user inputs the correct username and password and submits the login form
- **THEN** the system generates a secure, signed session token and sets it as an HTTP-only cookie.

#### Scenario: Failed Administrator Login
- **WHEN** the user inputs an incorrect username or password and submits the login form
- **THEN** the system returns an authentication error and does not set a session cookie.
