import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';

const Post = ({ title, description, postAuthor, postImage, postId, authorId }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const { data: session } = useSession();

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

    useEffect(() => {
        checkLikeStatus();
    }, [session, postId, checkLikeStatus]);

    useEffect(() => {
        if (postImage) {
            setImagePreview(postImage);
        }
    }, [postImage])

    return (
        <div className='flex justify-center w-full mt-6 px-4 sm:px-0'>
            <div className="bg-gray-900 rounded-lg shadow-md p-4 max-w-xl w-full">
                <p style={{ fontSize: '12px' }}>
                    @{postAuthor}
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
};

export default Post;
