import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar.js';
import AddPost from '../components/AddPost.js';
import Post from '../components/Post.js';
import AtomicSpinner from 'atomic-spinner'
import Head from 'next/head.js';
import NotLoggedIn from '../components/notLoggedIn.js';


const Home = () => {
    const { data: session, status } = useSession();
    const [postsArray, setPostsArray] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/getPosts');
            const data = await response.json();
            setPostsArray(data);
        };

        fetchPosts();

        const intervalId = setInterval(fetchPosts, 300000);

        return () => clearInterval(intervalId);
    }, []);

    if (status === "loading") return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div><AtomicSpinner atomSize={300} electronSize={2.5} /></div>
        </div>
    );

    if (session) {
        return (
            <div className='pt-16'>
                <Head>
                    <title>
                        GR-YP | Home
                    </title>
                    <link rel='icon' href='/favicon.ico' />
                </Head>
                <NavBar />
                <AddPost />
                {postsArray.map((post) => {
                    return (
                        <div key={post.id}>
                            <Post key={post.postTitle} title={post.postTitle} description={post.postContent}
                                postAuthor={post.postAuthor} postImage={post.postImage} postId={post.postId} authorId={post.authorId} />
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <NotLoggedIn />
        )
    }
};

export default Home;
