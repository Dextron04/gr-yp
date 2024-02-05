import React from 'react';
import AtomicSpinner from 'atomic-spinner'
import Head from 'next/head.js';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


const NotLoggedIn = () => {
    const router = new useRouter();
    const { data: session, status } = useSession();

    const handleLoginClick = () => {
        router.push("/");
    };

    if (status === "loading") return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div><AtomicSpinner atomSize={300} electronSize={2.5} /></div>
        </div>
    );

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
                    atomSize={typeof window !== 'undefined' && window.innerWidth <= 768 ? 620 : 800}
                    displayNucleus={false}
                />
            </div>
        </div>
    );
};

export default NotLoggedIn;
