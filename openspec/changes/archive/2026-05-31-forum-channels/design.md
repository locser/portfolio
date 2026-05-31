## Context

We are implementing a full-featured community forum/discussion channels system on our Next.js-based portfolio website. To maintain consistency, zero database external dependency, and fast performance, we will utilize local JSON file storage under the `src/data/forum/` directory, mirroring the comments and views architecture.

## Goals / Non-Goals

**Goals:**
- Provide a clean and premium user experience for community discussion.
- Support administrative capabilities to create, edit, and delete discussion channels.
- Support topic settings that toggle permissions between Admin-only topic creation and Free/Public topic creation.
- Allow users to sort topics by creation date or upvote counts.
- Support upvote/downvote buttons for every topic with dynamic state updating.
- Enable rich reply/comment trees for each topic.
- Increment view counts on topic detail pages.
- Add an admin interface at `/admin/dashboard` to manage channels.

**Non-Goals:**
- Implementing standard user sign-up/profiles: we will collect name and optional email (similar to the post comments system) rather than requiring full user sign-up.
- Real-time WebSockets communication: standard HTTP endpoints will suffice for this iteration.
- Media upload inside forum topics/replies (only textual input is supported initially).

## Decisions

### 1. Data Schema & Directory Layout

To store forum-related data cleanly, we will create a dedicated `src/data/forum/` directory containing three JSON files:
- `channels.json`: Lists the active discussion channels and their configurations.
- `topics.json`: Groups topics by `channelId` to optimize loading.
- `replies.json`: Groups comments/replies by `topicId`.

#### `src/data/forum/channels.json`
```json
[
  {
    "id": "channel-id",
    "title": "Channel Title",
    "description": "Channel Description",
    "allowPublicTopics": true,
    "createdAt": "2026-05-31T14:18:00.000Z"
  }
]
```

#### `src/data/forum/topics.json`
```json
{
  "channel-id": [
    {
      "id": "topic-id",
      "channelId": "channel-id",
      "title": "Topic Title",
      "authorName": "Cáo Tích Cực",
      "content": "Rich content for this topic...",
      "createdAt": "2026-05-31T14:20:00.000Z",
      "upvotes": 4,
      "downvotes": 0,
      "views": 28,
      "replyCount": 0
    }
  ]
}
```

#### `src/data/forum/replies.json`
```json
{
  "topic-id": [
    {
      "id": "reply-id",
      "authorName": "Commenter Name",
      "authorEmail": "email@example.com",
      "content": "Reply body content...",
      "createdAt": "2026-05-31T14:25:00.000Z"
    }
  ]
}
```

### 2. API Routes Structure

We will create the following RESTful API endpoints:

- `/api/forum/channels`:
  - `GET`: Retrieve all active channels.
  - `POST`: Create a new channel (Admin authorized).
  - `PUT`: Edit an existing channel (Admin authorized).
  - `DELETE`: Delete a channel and its associated topics/replies (Admin authorized).
- `/api/forum/topics`:
  - `GET`: Retrieve topics for a channel (supports `?channelId=<id>&sort=<upvotes|newest>`).
  - `POST`: Create a new topic. If the channel is admin-only, requires admin authorization cookie.
- `/api/forum/topics/vote`:
  - `POST`: Process a vote up/down. Body: `{ channelId, topicId, direction: 'up' | 'down' }`.
- `/api/forum/topics/detail`:
  - `GET`: Retrieve single topic details and increment the view count (requires `?channelId=<id>&topicId=<id>`).
- `/api/forum/replies`:
  - `GET`: Retrieve replies for a topic (`?topicId=<id>`).
  - `POST`: Submit a reply to a topic.

### 3. Authorization Mechanics

Admin commands (creating/editing/deleting channels and posting in admin-only channels) will verify the `admin_session` cookie via `@/src/lib/auth`:
```typescript
import { cookies } from "next/headers";
import { verifySessionToken } from "@/src/lib/auth";

const sessionToken = cookies().get("admin_session")?.value;
const isAdmin = sessionToken ? !!verifySessionToken(sessionToken) : false;
```

### 4. UI/UX Routes & Design Theme

We will build gorgeous routes to align with the website's dark, premium zinc-and-white visual palette:
- `/forum`: Lists all channels. Features neon glassmorphism cards, glowing status pill tags ("Admin-only" vs "Tự do"), and brief metrics (Total topics).
- `/forum/[channelId]`: Main workspace inside a channel. Displays channel metadata, sorting control (Most Upvotes vs Newest), and list of topics. Beautifully transitions to show a custom slide-down modal/form to "Create new topic".
- `/forum/[channelId]/[topicId]`: Details of a topic. Showcases the upvote/downvote dynamic count, the author's card, body text, and a clean comment timeline with slide-in reply actions.
- `/admin/dashboard`: A new tab/section will be integrated to manage channels, letting the admin add, edit, or delete them in real time.

## Risks / Trade-offs

- **Concurrent Write Race Conditions**: Since we are using standard local JSON files, multiple parallel writes could theoretically overwrite each other.
  - *Mitigation*: We will use synchronised file reads and writes with simple try-catch locks or atomic writes if needed, though for a personal portfolio with moderate traffic, standard Node.js FS methods are highly reliable.
- **Vote Spamming**: Without authentication, a user could theoretically spam the upvote/downvote endpoints.
  - *Mitigation*: We will track local storage keys `voted_topics` in the client's browser to disable double voting on the UI and check basic rate limits or client IP lists if needed.
