import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { imageProfile, userEmail } = req.body;

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


            await collection.updateOne(
                { $or: [{ email: userEmail }, { "user.email": userEmail }] },
                { $set: { "imageProfile": imageProfile } }
            );
            res.status(201).json({ message: 'Profile Photo Saved to database' })
        } catch (e) {
            res.status(500).json({ error: e.toString() });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}