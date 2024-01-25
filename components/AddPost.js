import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import { toast } from 'react-toastify';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';




const AddPost = () => {
    const [postContent, setPostContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postImage, setPostImage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const likes = [];
    const { data: session } = useSession();


    // Posting to the database.
    const handlePost = async () => {

        const postId = uuidv4();

        if (!postTitle || !postContent) {
            // toast("Please fill in all the details");
            return;
        }

        try {
            // Sumi proof
            const response = await axios.post('/api/savePost', {
                postTitle,
                postContent,
                postAuthor: session.user.name === 'john' ? 'sumi' : session.user.name,
                postImage,
                authorEmail: session.user.email,
                postId,
                likes,
            });

            if (response.status === 201) {
                console.log('Data Saved successfully');
                // toast.success("Post was successful!");
                setPostContent('');
                setPostTitle('');
                window.location.reload();
            } else {
                console.log('Something went wrong');
            }
        } catch (e) {
            console.error(`Error! ${e}`);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
                setImagePreview(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const base64 = await convertToBase64(file);
            setPostImage(base64);
        }
    }

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
                {imagePreview && <Image style={{ borderRadius: '10px', marginBottom: '15px' }} src={imagePreview} alt="preview" width={600} height={600} />}
                <div className="flex justify-between"> {/* Modify the className to "flex justify-between" */}
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 sm:w-auto"
                        onClick={handlePost}
                    >
                        Post
                    </button>
                    <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-4 sm:w-auto"
                        style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            id='fileInput'
                            style={{ display: 'none' }}  // Make room for the icon
                            type='file'
                            accept='image/*'
                            onChange={(e) => handleFileUpload(e)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                            style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)' }} // Position the icon
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPost;
