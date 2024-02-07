import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const client = new MongoClient(process.env.MONGODB_URI);
        const { userEmail } = req.body;

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('users');

            const user = await collection.findOne({ $or: [{ email: userEmail }, { "user.email": userEmail }] });
            if (user) {
                console.log("I found the user!!");
                console.log(user);
                res.status(200).json(user.username);
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