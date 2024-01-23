import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('posts');

            const posts = await collection.find().toArray();
            res.status(200).json(posts);
        } catch (e) {
            res.status(500).json({ error: e.toString() });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}