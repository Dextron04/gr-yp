import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Post = ({ title, description, postAuthor, postImage }) => {
    const [imagePreview, setImagePreview] = useState(null);

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
            </div>
        </div>
    );
};

export default Post;
