import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { postTitle, postContent, postAuthor } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('posts');

            await collection.insertOne({ postTitle, postContent, postAuthor });
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