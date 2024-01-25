import { MongoClient, ObjectId } from "mongodb";

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

        // Add the user's ID to the likes array if it's not already there
        if (!post.likes.includes(userId)) {
            await collection.updateOne(
                { postId: postId },
                { $push: { likes: userId } }
            );
        }

        await client.close();

        res.status(200).json({ message: 'Post liked' });
    } else if (req.method === 'DELETE') {
        const { postId, userId } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db('dexweb');
        const collection = database.collection('posts');

        const post = await collection.findOne({ postId: postId });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        // Remove the user's ID from the likes array if it's there
        if (post.likes.includes(userId)) {
            await collection.updateOne(
                { postId: postId },
                { $pull: { likes: userId } }
            );
        }

        await client.close();

        res.status(200).json({ message: 'Post unliked' });

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}