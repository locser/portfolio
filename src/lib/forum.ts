import { getDatabase } from "./mongodb";

// 1. Entity Interfaces
export interface Channel {
  id: string;
  title: string;
  description: string;
  allowPublicTopics: boolean; // true = Free/Public, false = Admin-only
  createdAt: string;
}

export interface Topic {
  id: string;
  channelId: string;
  title: string;
  authorName: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  views: number;
  replyCount: number;
}

export interface Reply {
  id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

// 2. Channels IO Helpers
export async function getChannels(): Promise<Channel[]> {
  try {
    const db = await getDatabase();
    const docs = await db.collection("forum_channels").find().toArray();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      allowPublicTopics: doc.allowPublicTopics,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error("Failed to read channels from MongoDB:", error);
    return [];
  }
}

export async function saveChannels(channels: Channel[]): Promise<void> {
  try {
    const db = await getDatabase();
    if (channels.length === 0) {
      await db.collection("forum_channels").deleteMany({});
      return;
    }

    const bulkOps = channels.map((c) => ({
      replaceOne: {
        filter: { _id: c.id },
        replacement: {
          _id: c.id,
          title: c.title,
          description: c.description,
          allowPublicTopics: c.allowPublicTopics,
          createdAt: c.createdAt,
        },
        upsert: true,
      },
    }));

    const ids = channels.map((c) => c.id);
    await db.collection("forum_channels").deleteMany({ _id: { $nin: ids as any } });
    await db.collection("forum_channels").bulkWrite(bulkOps as any);
  } catch (error) {
    console.error("Failed to write channels to MongoDB:", error);
  }
}

// 3. Topics IO Helpers
export async function getTopics(): Promise<Record<string, Topic[]>> {
  try {
    const db = await getDatabase();
    const docs = await db.collection("forum_topics").find().toArray();
    const map: Record<string, Topic[]> = {};
    docs.forEach((doc) => {
      const topic: Topic = {
        id: doc._id.toString(),
        channelId: doc.channelId,
        title: doc.title,
        authorName: doc.authorName,
        content: doc.content,
        createdAt: doc.createdAt,
        upvotes: doc.upvotes || 0,
        downvotes: doc.downvotes || 0,
        views: doc.views || 0,
        replyCount: doc.replyCount || 0,
      };
      if (!map[topic.channelId]) {
        map[topic.channelId] = [];
      }
      map[topic.channelId]!.push(topic);
    });
    return map;
  } catch (error) {
    console.error("Failed to read topics from MongoDB:", error);
    return {};
  }
}

export async function saveTopics(topicsMap: Record<string, Topic[]>): Promise<void> {
  try {
    const db = await getDatabase();
    const allTopics: Topic[] = [];
    for (const list of Object.values(topicsMap)) {
      allTopics.push(...list);
    }

    if (allTopics.length === 0) {
      await db.collection("forum_topics").deleteMany({});
      return;
    }

    const bulkOps = allTopics.map((t) => ({
      replaceOne: {
        filter: { _id: t.id },
        replacement: {
          _id: t.id,
          channelId: t.channelId,
          title: t.title,
          authorName: t.authorName,
          content: t.content,
          createdAt: t.createdAt,
          upvotes: t.upvotes,
          downvotes: t.downvotes,
          views: t.views,
          replyCount: t.replyCount,
        },
        upsert: true,
      },
    }));

    const ids = allTopics.map((t) => t.id);
    await db.collection("forum_topics").deleteMany({ _id: { $nin: ids as any } });
    await db.collection("forum_topics").bulkWrite(bulkOps as any);
  } catch (error) {
    console.error("Failed to write topics to MongoDB:", error);
  }
}

// 4. Replies IO Helpers
export async function getReplies(): Promise<Record<string, Reply[]>> {
  try {
    const db = await getDatabase();
    const docs = await db.collection("forum_replies").find().toArray();
    const map: Record<string, Reply[]> = {};
    docs.forEach((doc) => {
      const reply: Reply = {
        id: doc._id.toString(),
        authorName: doc.authorName,
        authorEmail: doc.authorEmail || undefined,
        content: doc.content,
        createdAt: doc.createdAt,
      };
      const topicId = doc.topicId;
      if (!map[topicId]) {
        map[topicId] = [];
      }
      map[topicId]!.push(reply);
    });
    return map;
  } catch (error) {
    console.error("Failed to read replies from MongoDB:", error);
    return {};
  }
}

export async function saveReplies(repliesMap: Record<string, Reply[]>): Promise<void> {
  try {
    const db = await getDatabase();
    const allReplies: { id: string; topicId: string; reply: Reply }[] = [];
    for (const [topicId, list] of Object.entries(repliesMap)) {
      list.forEach((reply) => {
        allReplies.push({ id: reply.id, topicId, reply });
      });
    }

    if (allReplies.length === 0) {
      await db.collection("forum_replies").deleteMany({});
      return;
    }

    const bulkOps = allReplies.map((item) => ({
      replaceOne: {
        filter: { _id: item.id },
        replacement: {
          _id: item.id,
          topicId: item.topicId,
          authorName: item.reply.authorName,
          authorEmail: item.reply.authorEmail || null,
          content: item.reply.content,
          createdAt: item.reply.createdAt,
        },
        upsert: true,
      },
    }));

    const ids = allReplies.map((item) => item.id);
    await db.collection("forum_replies").deleteMany({ _id: { $nin: ids as any } });
    await db.collection("forum_replies").bulkWrite(bulkOps as any);
  } catch (error) {
    console.error("Failed to write replies to MongoDB:", error);
  }
}

