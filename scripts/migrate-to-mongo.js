const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/portfolio?authSource=admin';

async function run() {
  console.log('Starting migration to MongoDB...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB.');
    const db = client.db();

    // 1. Migrate post views
    const viewsFilePath = path.join(__dirname, '../src/data/post-views.json');
    if (fs.existsSync(viewsFilePath)) {
      console.log('Migrating post views...');
      const data = JSON.parse(fs.readFileSync(viewsFilePath, 'utf8') || '{}');
      const collection = db.collection('post_views');
      for (const [slug, count] of Object.entries(data)) {
        await collection.replaceOne(
          { _id: slug },
          { _id: slug, views: count },
          { upsert: true }
        );
      }
      console.log(`Migrated ${Object.keys(data).length} post views.`);
    }

    // 2. Migrate post comments
    const commentsFilePath = path.join(__dirname, '../src/data/post-comments.json');
    if (fs.existsSync(commentsFilePath)) {
      console.log('Migrating post comments...');
      const data = JSON.parse(fs.readFileSync(commentsFilePath, 'utf8') || '{}');
      const collection = db.collection('post_comments');
      let totalComments = 0;
      for (const [slug, commentList] of Object.entries(data)) {
        for (const comment of commentList) {
          const doc = {
            _id: comment.id,
            slug: comment.slug || slug,
            authorName: comment.authorName,
            authorEmail: comment.authorEmail || null,
            content: comment.content,
            parentId: comment.parentId || null,
            createdAt: comment.createdAt
          };
          await collection.replaceOne({ _id: comment.id }, doc, { upsert: true });
          totalComments++;
        }
      }
      console.log(`Migrated ${totalComments} post comments.`);
    }

    // 3. Migrate forum channels
    const channelsFilePath = path.join(__dirname, '../src/data/forum/channels.json');
    if (fs.existsSync(channelsFilePath)) {
      console.log('Migrating forum channels...');
      const channels = JSON.parse(fs.readFileSync(channelsFilePath, 'utf8') || '[]');
      const collection = db.collection('forum_channels');
      for (const channel of channels) {
        const doc = {
          _id: channel.id,
          title: channel.title,
          description: channel.description,
          allowPublicTopics: channel.allowPublicTopics ?? true,
          createdAt: channel.createdAt
        };
        await collection.replaceOne({ _id: channel.id }, doc, { upsert: true });
      }
      console.log(`Migrated ${channels.length} forum channels.`);
    }

    // 4. Migrate forum topics
    const topicsFilePath = path.join(__dirname, '../src/data/forum/topics.json');
    if (fs.existsSync(topicsFilePath)) {
      console.log('Migrating forum topics...');
      const data = JSON.parse(fs.readFileSync(topicsFilePath, 'utf8') || '{}');
      const collection = db.collection('forum_topics');
      let totalTopics = 0;
      for (const [channelId, topicList] of Object.entries(data)) {
        for (const topic of topicList) {
          const doc = {
            _id: topic.id,
            channelId: topic.channelId || channelId,
            title: topic.title,
            authorName: topic.authorName,
            content: topic.content,
            createdAt: topic.createdAt,
            upvotes: topic.upvotes || 0,
            downvotes: topic.downvotes || 0,
            views: topic.views || 0,
            replyCount: topic.replyCount || 0
          };
          await collection.replaceOne({ _id: topic.id }, doc, { upsert: true });
          totalTopics++;
        }
      }
      console.log(`Migrated ${totalTopics} forum topics.`);
    }

    // 5. Migrate forum replies
    const repliesFilePath = path.join(__dirname, '../src/data/forum/replies.json');
    if (fs.existsSync(repliesFilePath)) {
      console.log('Migrating forum replies...');
      const data = JSON.parse(fs.readFileSync(repliesFilePath, 'utf8') || '{}');
      const collection = db.collection('forum_replies');
      let totalReplies = 0;
      for (const [topicId, replyList] of Object.entries(data)) {
        for (const reply of replyList) {
          const doc = {
            _id: reply.id,
            topicId: topicId,
            authorName: reply.authorName,
            authorEmail: reply.authorEmail || null,
            content: reply.content,
            createdAt: reply.createdAt
          };
          await collection.replaceOne({ _id: reply.id }, doc, { upsert: true });
          totalReplies++;
        }
      }
      console.log(`Migrated ${totalReplies} forum replies.`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
  }
}

run();
