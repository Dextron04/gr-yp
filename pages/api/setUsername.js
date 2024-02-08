import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const client = new MongoClient(process.env.MONGODB_URI);
        const { newUsername, username } = req.body;

        try {
            console.log(newUsername);
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('users');
            const postsCollection = database.collection('posts');

            const user = await collection.findOne({ username: username });
            const userPost = await postsCollection.findOne({ authorUsername: username });
            if (userPost) {
                await postsCollection.updateMany(
                    { authorUsername: username },
                    { $set: { "authorUsername": newUsername } },
                );
            };

            // Will Check if the user exists.
            if (user) {
                // Will check if the username has already been taken.
                if (newUsername !== username) {
                    const existingUser = await collection.findOne({ username: newUsername });
                    if (existingUser) {
                        res.status(400).json({ message: 'Username already taken' });
                        return;
                    } else {
                        // If everything is correct then the username will be updated
                        await collection.updateOne(
                            { username: username },
                            { $set: { "username": newUsername } }
                        );
                        res.status(201).json({ message: 'Username Saved to database' });
                    }
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }

        } catch (e) {
            res.status(500).json({ error: e.toString() });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}