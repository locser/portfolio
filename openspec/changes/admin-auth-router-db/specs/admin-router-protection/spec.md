## ADDED Requirements

### Requirement: Route Middleware Protection
The system SHALL execute middleware on every request to verify the admin session token for protected routes.

#### Scenario: Access Protected Route Unauthenticated
- **WHEN** a request is made to any route under `/admin/*` (except `/admin/login`) or modification APIs (POST/PUT/DELETE under `/api/posts/*` and `/api/forum/*`) without a valid session token
- **THEN** the system redirects the request to `/admin/login` or returns a 401 Unauthorized response for APIs.

#### Scenario: Access Protected Route Authenticated
- **WHEN** a request is made to protected admin routes or modification APIs with a valid, signed session token
- **THEN** the system allows the request to proceed to the target page or API handler.
