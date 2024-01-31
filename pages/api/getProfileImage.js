import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userEmail } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('users');

            const user = await collection.findOne({ $or: [{ email: userEmail }, { "user.email": userEmail }] });

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ message: 'Profile Photo Saved to database', profilePhoto: user.imageProfile })
        } catch (e) {
            res.status(500).json({ error: e.toString() });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}