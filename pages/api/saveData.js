import { MongoClient } from 'mongodb';
import bcrypt, { hash } from 'bcrypt';
import { error, log } from 'console';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body; // Extract username from the request body

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            // Connecting to the database
            await client.connect();
            const database = client.db('dexweb');
            const collection = database.collection('users');

            // Hashing Process
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const isAvailable = await isValid(username, email);

            // Insert the username into the collection
            if (isAvailable) {
                await collection.insertOne({ username, email, hashedPassword });
                res.status(201).json({ message: 'Data saved successfully!' });
            } else {
                return res.status(400).json({ message: 'Username or email already exists!' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!' });
        } finally {
            await client.close();
        }
    } else {
        res.status(400).json({ message: 'Method not allowed!' });
    }
}

async function isValid(username, email) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect()
        const database = client.db('dexweb');
        const collection = database.collection('users');

        const user = await collection.findOne({ $or: [{ username }, { email }] });

        // console.log(user === null);
        return user === null;
    } catch (e) {
        error(e);
        return false;
    } finally {
        await client.close();
    }
}