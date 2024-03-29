import { MongoClient } from "mongodb";

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { postId, userId } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db('dexweb');
        const collection = database.collection('posts');

        const post = await collection.findOne({ postId: postId });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        } else {
            // res.status(200).json({ message: "Post Found!" });
            const isLiked = post.likes.includes(userId);
            const likesCount = post.likes.length;
            res.status(200).json({ isLiked, likesCount });
        }

        await client.close();

        res.status(200).json({ message: 'Check Complete' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}