import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { postTitle, postContent, postAuthor, postImage, authorEmail, postId, likes } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('posts');
            const usersCollection = database.collection('users');

            const user = await usersCollection.findOne({ $or: [{ email: authorEmail }, { "user.email": authorEmail }] });


            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const authorId = user.userId;

            await collection.insertOne({ postTitle, postContent, postAuthor, postImage, authorId, postId, likes });
            res.status(201).json({ message: 'Post Saved to database' })
        } catch (e) {
            res.status(500).json({ error: e.toString() });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}