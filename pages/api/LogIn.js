import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    console.log(req.method);
    if (req.method === 'POST') {
        console.log('I"m here');
        const { username, password } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const db = client.db('dexweb');
            const collection = db.collection('users');

            const user = await collection.findOne({ username });

            if (user) {
                const isMatch = await bcrypt.compare(password, user.hashedPassword);
                if (isMatch) {
                    return res.status(200).json({ message: 'User found!' });
                } else {
                    return res.status(401).json({ message: 'Invalid credentials!' });
                }
            } else {
                // console.log("I'm here and I didn't find the user");
                return res.status(404).json({ message: 'User not found!' });
            }
        } catch (error) {
            console.log(`${error}`);
            return res.status(500).json({ message: 'Something went wrong!' });
        } finally {
            await client.close();
        }
    } else if (req.method === 'GET') {
        res.setHeader('Allow', ['POST']);
        return res.status(200).json({ message: 'GET method is not allowed!' });
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed!' });
    }
}