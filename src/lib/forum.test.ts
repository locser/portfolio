import fs from "fs";

import {
  getChannels,
  saveChannels,
  getTopics,
  saveTopics,
  getReplies,
  saveReplies,
  Channel,
  Topic,
  Reply,
} from "./forum";

jest.mock("fs");

describe("forum.ts helper functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("File initialization and getChannels", () => {
    it("should initialize directories and files if they do not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const channels = getChannels();

      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(3); // Channels, topics, replies
      expect(channels).toEqual([]);
    });

    it("should read channels successfully if file exists", () => {
      const mockChannels: Channel[] = [
        {
          id: "general",
          title: "General Discussion",
          description: "Talk about anything",
          allowPublicTopics: true,
          createdAt: "2026-06-11T12:00:00.000Z",
        },
      ];

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockChannels));

      const channels = getChannels();

      expect(channels).toEqual(mockChannels);
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it("should return empty array and handle read error gracefully", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("Disk read error");
      });

      const channels = getChannels();
      expect(channels).toEqual([]);
    });
  });

  describe("saveChannels", () => {
    it("should write channels data to the correct file path", () => {
      const mockChannels: Channel[] = [
        {
          id: "general",
          title: "General Discussion",
          description: "Talk about anything",
          allowPublicTopics: true,
          createdAt: "2026-06-11T12:00:00.000Z",
        },
      ];

      (fs.existsSync as jest.Mock).mockReturnValue(true);

      saveChannels(mockChannels);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("channels.json"),
        JSON.stringify(mockChannels, null, 2),
        "utf8"
      );
    });
  });

  describe("getTopics & saveTopics", () => {
    it("should get topics dictionary correctly", () => {
      const mockTopics: Record<string, Topic[]> = {
        general: [
          {
            id: "t1",
            channelId: "general",
            title: "Hello World",
            authorName: "Alice",
            content: "Welcome to my portfolio",
            createdAt: "2026-06-11T12:00:00.000Z",
            upvotes: 5,
            downvotes: 0,
            views: 10,
            replyCount: 0,
          },
        ],
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTopics));

      const topics = getTopics();
      expect(topics).toEqual(mockTopics);
    });

    it("should save topics dictionary successfully", () => {
      const mockTopics: Record<string, Topic[]> = {};
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      saveTopics(mockTopics);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("topics.json"),
        JSON.stringify(mockTopics, null, 2),
        "utf8"
      );
    });
  });

  describe("getReplies & saveReplies", () => {
    it("should get replies dictionary correctly", () => {
      const mockReplies: Record<string, Reply[]> = {
        t1: [
          {
            id: "r1",
            authorName: "Bob",
            content: "Awesome post!",
            createdAt: "2026-06-11T12:05:00.000Z",
          },
        ],
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockReplies));

      const replies = getReplies();
      expect(replies).toEqual(mockReplies);
    });

    it("should save replies dictionary successfully", () => {
      const mockReplies: Record<string, Reply[]> = {};
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      saveReplies(mockReplies);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("replies.json"),
        JSON.stringify(mockReplies, null, 2),
        "utf8"
      );
    });
  });
});
