import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';

const Post = ({ title, description, postAuthor, postImage, postId, authorId, authorUsername }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const { data: session } = useSession();
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [commentsData, setCommentsData] = useState([]);

    const handleLikeClick = async () => {
        const userId = session.user.email;
        try {
            if (!isLiked) {
                const response = await fetch('/api/handleLike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ postId, userId })
                });

                if (response.ok) {
                    setIsLiked(true);
                }
            } else {
                const response = await fetch('api/handleLike', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ postId, userId })
                })
                if (response.ok) {
                    setIsLiked(false);
                }
            }
            checkLikeStatus();
        } catch (error) {
            console.error('Error making request:', error);
        }
    };

    const checkLikeStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/checkLikeStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, userId: session.user.email })
            });
            const data = await response.json();
            setIsLiked(data.isLiked);
            setLikesCount(data.likesCount);
        } catch (error) {
            console.error('Error making request:', error);
        }
    }, [postId, session.user.email]); // Add an empty array as the second argument to useCallback

    // Running Checks to verify number of likes
    useEffect(() => {
        checkLikeStatus();
    }, [session, postId, checkLikeStatus]);


    // Rendering images for posts
    useEffect(() => {
        if (postImage) {
            setImagePreview(postImage);
        }
    }, [postImage])

    // Show and Hide Comment Section
    const handleCommentClick = () => {
        showComments ? setShowComments(false) : setShowComments(true);
        getComments();
    };

    // Add a comment to the comment section
    const submitComment = async () => {
        const response = await fetch('/api/handleComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId, userId: session.user.email, comment })
        });

        if (response.ok) {
            console.log("Comment Successful");
            setComment("");
            getComments();
        }
    };

    // Check all the comments in the comment section
    const getComments = async () => {
        const response = await fetch('/api/getComments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId })
        });

        if (response.ok) {
            console.log("Fetch Successful for Post ID: ", postId);
            const data = await response.json();
            setCommentsData(data.comments);
            setCommentsCount(data.commentsCount);
            // console.log(data);
        }
    };


    return (
        <div className='flex justify-center w-full mt-6 px-4 sm:px-0'>
            <div className="bg-gray-900 rounded-lg shadow-md p-4 max-w-xl w-full">
                <p style={{ fontSize: '12px' }}>
                    @{authorUsername}
                </p>
                <h2 className="text-xl font-bold">
                    <textarea
                        className=" bg-gray-900 w-full h-8 mt-2 border-transparent rounded mb-2 resize-none overflow-hidden focus:outline-none"
                        value={title}
                        readOnly
                    />
                </h2>
                <p className='overflow-auto'>
                    {description}
                </p>
                {imagePreview && <Image style={{ borderRadius: '10px', marginBottom: '15px' }} src={imagePreview} alt="preview" width={600} height={600} />}
                <div className='mt-3'>
                    {!isLiked ? (
                        <div className='flex flex-row'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-3" onClick={handleLikeClick}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            Liked by {likesCount}
                        </div>
                    ) : (
                        <div className='flex flex-row'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3" onClick={handleLikeClick}>
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                            Liked by {likesCount}
                        </div>
                    )}
                    <div className='mt-1 flex flex-row'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-3" onClick={handleCommentClick}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                        Commented By {commentsCount}
                    </div>

                    {showComments && (
                        <div>
                            <div className='mt-3 min-h-72 max-h-72 overflow-y-auto'>
                                {/* Comments will go here */}
                                {commentsData && Array.isArray(commentsData) && commentsData.map((commentObj, index) => (
                                    <div key={index}>
                                        <h3>@{commentObj.userId}</h3>
                                        {commentObj.userComments.map((comment, index) => (
                                            <p className='ml-5' key={index}> : {comment}</p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <textarea className="w-full px-3 py-2 placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                                    placeholder="Add a comment"
                                    onChange={(e) => setComment(e.target.value)}
                                    value={comment}
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 sm:w-auto" onClick={submitComment}>Post Comment</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
Post.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    postAuthor: PropTypes.string.isRequired,
    postImage: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorUsername: PropTypes.string.isRequired,
};

export default Post;
