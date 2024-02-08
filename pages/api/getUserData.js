import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const client = new MongoClient(process.env.MONGODB_URI);
        const { username, userEmail } = req.body;

        try {
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('users');

            const user = await collection.findOne({ $or: [{ email: userEmail }, { username: username }] });
            console.log(userEmail);
            // console.log(user);

            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ message: "No such user" });
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