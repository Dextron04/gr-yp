import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { firebase, database } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


const AddPost = () => {
    const [postContent, setPostContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const { data: session } = useSession();

    const handlePost = () => {
        // Handle the post logic here, e.g. send the post content to a server
        const db = collection(database, 'posts');

        addDoc(db, {
            post_title: postTitle,
            post_content: postContent,
            postAuthor: session.user.name,
        }).then(() => {
            setPostContent('');
            setPostTitle('');
        })
        // Reset the post content after posting
    };

    return (
        <div className='flex justify-center w-full mt-6 px-4 sm:px-0'>
            <div className="bg-gray-900 rounded-lg shadow-md p-4 max-w-xl w-full">
                <h2 className="text-xl font-bold mb-2">
                    <textarea
                        className=" bg-gray-900 w-full h-8 p-2 border-transparent rounded mb-2 resize-none overflow-hidden focus:outline-none"
                        placeholder='Post Title'
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        style={{ minHeight: '20px', maxHeight: '100%' }}
                    />
                </h2>
                <textarea
                    className=" bg-gray-900 w-full h-20 p-2 border border-gray-300 rounded mb-2 resize-none overflow-auto"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{ minHeight: '20px', maxHeight: '100%' }}
                ></textarea>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 sm:w-auto"
                    onClick={handlePost}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default AddPost;
