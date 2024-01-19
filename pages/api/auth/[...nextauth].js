import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import Twitter from 'next-auth/providers/twitter';
import GitHub from 'next-auth/providers/github';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { error } from 'console';

export default NextAuth({
    providers: [
        Google({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                const { username, password } = credentials

                const client = new MongoClient(process.env.MONGODB_URI);
                // const client = new MongoClient(`mongodb://localhost:27017/`); ---> This one is for testing in local MongoDB

                try {
                    await client.connect();
                    const db = client.db('dexweb');
                    const collection = db.collection('users');

                    const user = await collection.findOne({ username });

                    if (user) {
                        const isMatch = await bcrypt.compare(password, user.hashedPassword);
                        if (isMatch) {
                            return { _id: user._id, name: user.username, email: user.email }
                        } else {
                            throw new Error("Invalid Password")
                        }
                    } else {
                        throw new Error("Invalid Username")
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
        }),
        Twitter({
            clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET,
            // callbackUrl: process.env.TWITTER_CALLBACK_URL,
        }),
        GitHub({
            // clientId: process.env.GITHUB_CLIENT_ID_TEST,
            // clientSecret: process.env.GITHUB_CLIENT_SECRET_TEST,

            clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        })
        // Other providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // Storing the userinfo in the database
        async signIn(user, account, profile) {
            const client = new MongoClient(process.env.MONGODB_URI);
            try {
                await client.connect();
                let collection;
                const db = client.db('dexweb');
                if (user.account.provider === 'google') {
                    collection = db.collection("google");
                } else if (user.account.provider === 'twitter') {
                    collection = db.collection("twitter");
                } else if (user.account.provider === 'github') {
                    collection = db.collection("github");
                } else {
                    throw new Error("Invalid Provider");
                }

                const newUser = {
                    user: user.user,
                    account: user.account,
                    profile: user.profile,
                }

                await collection.insertOne(newUser);
            } catch (e) {
                error(e);
            } finally {
                await client.close();
            }
            return true;
        }
    }
    // Other NextAuth configuration here
})