import React from 'react';

const Post = ({ title, description, postAuthor }) => {
    return (
        <div className='flex justify-center w-full mt-6 px-4 sm:px-0'>
            <div className="bg-gray-900 rounded-lg shadow-md p-4 max-w-xl w-full">
                <h2 className="text-xl font-bold mb-2">
                    <textarea
                        className=" bg-gray-900 w-full h-8 p-2 border-transparent rounded mb-2 resize-none overflow-hidden focus:outline-none"
                        value={title}
                        readOnly
                    />
                </h2>
                <p className='overflow-auto'>
                    {description}
                </p>
                <p>
                    {postAuthor}
                </p>
            </div>
        </div>
    );
};

export default Post;
