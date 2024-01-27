import { MongoClient } from "mongodb";

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { postId, userId, comment } = req.body;

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
            // const commentsCount = post.comments.length;
            res.status(200).json({ message: "Comment Successful" });
        }

        /// Find the user in the comments array
        const userComment = post.comments.find(comment => comment.userId === userId);

        if (userComment) {
            // If the user is found, push the comment to their comments array
            await collection.updateOne(
                { postId: postId, 'comments.userId': userId },
                { $push: { 'comments.$.userComments': comment } }
            );
        } else {
            // If the user is not found, add a new object to the comments array
            await collection.updateOne(
                { postId: postId },
                { $push: { comments: { userId: userId, userComments: [comment] } } }
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