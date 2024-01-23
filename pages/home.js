import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NavBar from '../components/NavBar.js';
import AddPost from '../components/AddPost.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { database } from '../firebase/firebaseConfig';
import Post from '../components/Post.js';


const Home = () => {
    const { data: session } = useSession();
    const router = new useRouter();
    const [post, setPost] = useState({ title: '', content: '', postAuthor: '' });
    const [postsArray, setPostsArray] = useState([]);


    const handleLoginClick = () => {
        router.push('/');
    }

    const handlePost = (title, content, author) => {
        // console.log(author);
        setPost({ title, content, author });
    };

    const getPosts = () => {
        const db = collection(database, 'posts');

        getDocs(db)
            .then((data) => {
                setPostsArray(data.docs.map((item) => {
                    return ({ ...item.data(), id: item.id })
                }));
            })
    }

    useEffect(() => {
        const refreshPosts = () => {
            getPosts();
            setTimeout(refreshPosts, 5 * 60 * 1000); // Refresh every 5 minutes
        };

        refreshPosts();
    }, []);

    if (session) {
        return (
            <div className='pt-16'>
                <NavBar />
                {/* <p>You are signed in as {session.user.name}</p> */}
                <AddPost onPost={handlePost} />
                {postsArray.map((post) => {
                    return (
                        <div key={post.id}>
                            <Post title={post.post_title} description={post.post_content} postAuthor={post.postAuthor} />
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
