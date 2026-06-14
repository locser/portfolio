import fs from "fs";
import path from "path";

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

// 2. Storage Paths
const DATA_DIR = path.join(process.cwd(), "src/data/forum");
const CHANNELS_FILE = path.join(DATA_DIR, "channels.json");
const TOPICS_FILE = path.join(DATA_DIR, "topics.json");
const REPLIES_FILE = path.join(DATA_DIR, "replies.json");

function ensureDirectoryAndFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHANNELS_FILE)) {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(TOPICS_FILE)) {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify({}, null, 2), "utf8");
  }
  if (!fs.existsSync(REPLIES_FILE)) {
    fs.writeFileSync(REPLIES_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

// 3. Channels IO Helpers
export function getChannels(): Channel[] {
  ensureDirectoryAndFiles();
  try {
    const data = fs.readFileSync(CHANNELS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Failed to read channels file:", error);
    return [];
  }
}

export function saveChannels(channels: Channel[]): void {
  ensureDirectoryAndFiles();
  try {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write channels file:", error);
  }
}

// 4. Topics IO Helpers
export function getTopics(): Record<string, Topic[]> {
  ensureDirectoryAndFiles();
  try {
    const data = fs.readFileSync(TOPICS_FILE, "utf8");
    return JSON.parse(data || "{}");
  } catch (error) {
    console.error("Failed to read topics file:", error);
    return {};
  }
}

export function saveTopics(topics: Record<string, Topic[]>): void {
  ensureDirectoryAndFiles();
  try {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write topics file:", error);
  }
}

// 5. Replies IO Helpers
export function getReplies(): Record<string, Reply[]> {
  ensureDirectoryAndFiles();
  try {
    const data = fs.readFileSync(REPLIES_FILE, "utf8");
    return JSON.parse(data || "{}");
  } catch (error) {
    console.error("Failed to read replies file:", error);
    return {};
  }
}

export function saveReplies(replies: Record<string, Reply[]>): void {
  ensureDirectoryAndFiles();
  try {
    fs.writeFileSync(REPLIES_FILE, JSON.stringify(replies, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write replies file:", error);
  }
}
