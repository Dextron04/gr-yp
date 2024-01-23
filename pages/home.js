import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar.js';
import AddPost from '../components/AddPost.js';
import Post from '../components/Post.js';
import AtomicSpinner from 'atomic-spinner'


const Home = () => {
    const { data: session, status } = useSession();
    const router = new useRouter();
    const [post, setPost] = useState({ title: '', content: '', postAuthor: '' });
    const [postsArray, setPostsArray] = useState([]);


    const handleLoginClick = () => {
        router.push('/');
    }

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
                <NavBar />
                <AddPost />
                {postsArray.map((post) => {
                    return (
                        <div key={post.id}>
                            <Post title={post.postTitle} description={post.postContent} postAuthor={post.postAuthor} />
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div>
                <div>You are not logged in.</div>
                <button onClick={handleLoginClick}>Log In</button>
            </div>
        )
    }
};

export default Home;
