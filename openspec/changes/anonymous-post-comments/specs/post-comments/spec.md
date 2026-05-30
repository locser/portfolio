## ADDED Requirements

### Requirement: Fetch Comments for a Post
The system SHALL retrieve all comments associated with a specific blog post slug. The returned comments list MUST be organized into a 2-level hierarchical structure, separating root comments from replies. Root comments SHALL be returned in reverse-chronological order (newest first), and replies under each root comment SHALL be sorted in chronological order (oldest first).

#### Scenario: Retrieve comments for a post
- **WHEN** a GET request is made to `/api/posts/comments` with a valid `slug` parameter
- **THEN** the system returns a status code of 200 and a list of root comments, each containing their nested direct replies

#### Scenario: Retrieve comments for a post with no comments
- **WHEN** a GET request is made to `/api/posts/comments` with a valid `slug` parameter that has no comments recorded
- **THEN** the system returns a status code of 200 and an empty array `[]`

---

### Requirement: Add a Comment
The system SHALL allow anonymous users to submit a new root comment on any blog post. Submitting a comment requires a valid blog post `slug`, a non-empty `authorName`, and a non-empty `content` body. The `authorEmail` field is optional and MUST be validated as a valid email address format if provided. All submitted names and contents MUST be sanitized to prevent HTML/Script injection.

#### Scenario: Create a root comment successfully
- **WHEN** a POST request is made to `/api/posts/comments` with a valid `slug`, `authorName` "Jane Doe", and `content` "Great article!"
- **THEN** the system returns a status code of 201 with the created comment object, which includes a generated unique ID, a timestamp, and a null `parentId`

#### Scenario: Create a root comment with optional email
- **WHEN** a POST request is made to `/api/posts/comments` with a valid `slug`, `authorName` "Bob", `content` "Loved the tips!", and a valid `authorEmail` "bob@example.com"
- **THEN** the system returns a status code of 201 and stores the email address to allow potential notifications later

#### Scenario: Fail to create comment due to missing required fields
- **WHEN** a POST request is made to `/api/posts/comments` with an empty `authorName` or empty `content`
- **THEN** the system returns a status code of 400 and an error message specifying the missing fields

---

### Requirement: Reply to a Comment
The system SHALL support reply functionality, permitting users to comment on an existing comment. To prevent deep, unreadable nesting, the system SHALL enforce a maximum of 2 levels of comment depth. A level 1 comment is a root comment (`parentId` is null). A level 2 comment is a reply (`parentId` points to a level 1 comment). If a user attempts to reply to a level 2 comment, the system SHALL associate the new comment directly with the root (level 1) parent comment, thereby preserving the 2-level constraint.

#### Scenario: Successfully reply to a root comment
- **WHEN** a POST request is made to `/api/posts/comments` with `parentId` pointing to a root comment ID, a valid `slug`, `authorName`, and `content`
- **THEN** the system returns a status code of 201 with the created comment containing the `parentId` set to the root comment ID

#### Scenario: Reply to a level 2 comment (Auto-promote to root parent)
- **WHEN** a POST request is made to `/api/posts/comments` with a `parentId` pointing to an existing level 2 comment ID
- **THEN** the system automatically resolves the parent of that level 2 comment (the root comment) and sets the new reply's `parentId` to the root comment's ID, returning 201
