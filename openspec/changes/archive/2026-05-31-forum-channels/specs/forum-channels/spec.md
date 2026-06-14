## ADDED Requirements

### Requirement: Admin Create Channel
The system SHALL allow administrator users to create new discussion channels, each containing a Title, Description, and a topic creation permission setting (Admin-only or Free/Public).

#### Scenario: Admin creates a channel with public topic creation
- **WHEN** an admin enters a title and description, selects the "Free/Public" topic creation permission, and clicks "Create Channel"
- **THEN** a new discussion channel is created with the specified properties and added to the database.

#### Scenario: Admin creates a channel with admin-only topic creation
- **WHEN** an admin enters a title and description, selects the "Admin-only" topic creation permission, and clicks "Create Channel"
- **THEN** a new discussion channel is created and restricted so only administrators can post topics.

### Requirement: View Channels
The system SHALL allow all visitors (anonymous or logged-in) to view a list of all available discussion channels, showing the channel title, description, and total topic count.

#### Scenario: Visitor navigates to the forum homepage
- **WHEN** a visitor navigates to the `/forum` route
- **THEN** the system fetches and displays the list of all active discussion channels.

### Requirement: Create Topic in Channel
The system SHALL allow users to create new discussion topics within a channel, subject to the channel's topic creation permission settings.

#### Scenario: Regular user creates a topic in a public channel
- **WHEN** a visitor navigates to a channel with "Free/Public" topic permissions, enters a title, author name, and content, and clicks "Create Topic"
- **THEN** the new topic is created and displayed in the channel's topic list.

#### Scenario: Regular user views an admin-only channel
- **WHEN** a visitor navigates to a channel with "Admin-only" topic permissions
- **THEN** the system hides or disables the "Create Topic" form for regular users, preventing them from creating topics.

#### Scenario: Administrator creates a topic in an admin-only channel
- **WHEN** an authenticated administrator logs in and navigates to a channel with "Admin-only" topic permissions, and submits the topic form
- **THEN** the system allows the creation and lists the topic in the channel.

### Requirement: Upvote and Downvote Topics
The system SHALL allow visitors to upvote or downvote discussion topics, incrementing the respective count and updating the net score.

#### Scenario: Visitor upvotes a topic
- **WHEN** a visitor clicks the "Upvote" (↑) arrow button on a topic
- **THEN** the upvote count of the topic is incremented by 1 and the updated score is displayed immediately.

#### Scenario: Visitor downvotes a topic
- **WHEN** a visitor clicks the "Downvote" (↓) arrow button on a topic
- **THEN** the downvote count of the topic is incremented by 1 and the updated score is displayed immediately.

### Requirement: Sort Topics in Channel
The system SHALL allow visitors to sort topics in a channel by either net upvote score (highest first) or creation time (newest first).

#### Scenario: Visitor sorts topics by most upvotes
- **WHEN** a visitor views a channel and selects the "Most Upvotes" sorting option
- **THEN** the system displays the topics in descending order of their net upvote score (Upvotes minus Downvotes).

#### Scenario: Visitor sorts topics by newest
- **WHEN** a visitor views a channel and selects the "Newest" sorting option
- **THEN** the system displays the topics in descending order of their creation timestamp.

### Requirement: Reply to Topic
The system SHALL allow visitors to post comments/replies inside a topic, capturing their author name, optional email, and message content.

#### Scenario: Visitor posts a comment in a topic
- **WHEN** a visitor reads a topic, fills in their author name, optional email, and reply message, and clicks "Submit Reply"
- **THEN** the reply is persisted, appended to the topic's reply list, and the topic's reply count is incremented by 1.

### Requirement: Topic View Counting
The system SHALL increment a topic's view count by 1 whenever a visitor loads the details page for that topic.

#### Scenario: Visitor opens a topic details page
- **WHEN** a visitor navigates to a topic's details page (e.g., `/forum/[channelId]/[topicId]`)
- **THEN** the topic's view count is incremented and the updated count is shown.
