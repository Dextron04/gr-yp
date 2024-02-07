import { MongoClient } from "mongodb";

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { postId } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db('dexweb');
        const collection = database.collection('posts');

        const post = await collection.findOne({ postId: postId });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        } else {
            const commentsCount = post.comments.length;
            res.status(200).json({ message: "Comment Fetch Successful", comments: post.comments, commentsCount: commentsCount });
        }

        await client.close();

        res.status(200).json({ message: 'Check Complete' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}