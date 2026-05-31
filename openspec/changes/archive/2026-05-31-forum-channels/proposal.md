## Why

To enhance community interaction and foster knowledge-sharing on the portfolio platform, we need a dedicated forum/discussion section. This space will allow administrators to host focused channels (e.g., Q&A sessions, topic discussions) and enable members to actively engage through custom topics, upvotes/downvotes, and comments.

## What Changes

- **Admin Channel Management**: Administrators can create, update, and delete discussion channels. Each channel has settings to control who can create topics (Admin-only or Free/All users).
- **Interactive Discussion Forum**: Users can view the list of channels and browse topics within a channel.
- **Topic Creation & Browsing**: Users (or admins only, depending on settings) can create rich discussion topics.
- **Sorting & Upvoting**: Users can upvote and downvote topics to surface the best ideas. Topics can be sorted by upvote count (highest first) or by creation time (newest first).
- **Engaging Discussions (Replies)**: Members can comment/reply to topics, and topics will display statistics like total replies, views, and votes.

## Capabilities

### New Capabilities
- `forum-channels`: Manages discussion channels, topic creation, sorting/upvoting system, replies/comments, and administrative settings.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **UI & Routes**: New routes for the forum: `/forum` (viewing channels), `/forum/[channelId]` (browsing topics in a channel), and `/forum/[channelId]/[topicId]` (reading/replying to a topic).
- **Admin Dashboard**: A new admin interface under `/admin/dashboard/forums` to manage channels (create, edit, delete, configure settings).
- **Data Layer**: New data storage/files or API endpoints to persist channels, topics, replies, views, and votes.
- **Dependencies**: React Icons for UI elements, Framer Motion for smooth transitions, and standard styling for rich UI aesthetics.
