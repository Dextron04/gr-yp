import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar.js';
import AddPost from '../components/AddPost.js';
import Post from '../components/Post.js';
import AtomicSpinner from 'atomic-spinner'
import Head from 'next/head.js';


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
            <div className="flex flex-col items-center justify-center h-screen">
                <Head>
                    <title>
                        GR-YP | Home
                    </title>
                    <link rel='icon' href='/favicon.ico' />
                </Head>
                <div className='flex justify-normal flex-col fixed'>
                    <div className="text-xl font-bold mb-4">You are not logged in.</div>
                    <button
                        className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleLoginClick}
                    >
                        Log In
                    </button>
                </div>
                <div style={{ position: 'fixed', zIndex: '-1' }}>
                    <AtomicSpinner
                        atomSize={window.innerWidth <= 768 ? 620 : 800}
                        displayNucleus={false}
                    />
                </div>
            </div>
        )
    }
};

export default Home;
