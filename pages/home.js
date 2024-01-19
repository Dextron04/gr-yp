import { useRouter } from 'next/router';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import NavBar from '../components/NavBar';

const Home = () => {
    const { data: session } = useSession();
    const router = new useRouter();

    const handleLoginClick = () => {
        router.push('/');
    }
    if (session) {
        return (
            <div className='pt-16'>
                <NavBar />
                <h1>Welcome to the Home Page</h1>
                <p>You are signed in as {session.user.name}</p>
                {/* <button onClick={() => signOut()}>Sign Out</button> */}
                {/* Add your content here */}
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
