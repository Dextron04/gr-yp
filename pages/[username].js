import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useSession } from 'next-auth/react';
import AtomicSpinner from 'atomic-spinner';
import Image from 'next/image';
import NotLoggedIn from '../components/notLoggedIn';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { username } = router.query;
    const [userData, setUserData] = useState('');


    // Used to fetch username from the database

    useEffect(() => {
        if (session) {
            const fetchProfileData = async () => {
                try {
                    const response = await fetch('/api/getUserData', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                        })
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        setUserData(data.user);
                    } else {
                        console.log('Something went wrong');
                        toast.warn("The User Does not exist")
                    }
                } catch (e) {
                    console.error(`Error! ${e}`);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchProfileData();
        }
    });


    if (isLoading && !userData) {
        return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div><AtomicSpinner atomSize={300} electronSize={2.5} /></div>
        </div>)
    }

    if (session) {
        return (
            <div>

                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '-1' }}
                    onClick={() => document.getElementById('fileInput').click()}>
                    <AtomicSpinner
                        atomSize={300}
                        displayNucleus={false}
                        electronPathCount={20}
                        electronPathWidth={0.5}
                        electronsPerPath={10}
                        electronSize={3.5}
                        electronSpeed={0.2}
                        displayElectronPaths={false}
                        nucleusParticleBorderWidth={0.1}
                        nucleusLayerCount={2}
                        nucleusParticlesPerLayer={2}
                        nucleusParticleSize={4.7}
                        nucleusDistanceFromCenter={1.4}
                        nucleusSpeed={2}
                        nucleusMaskOverlap={true}
                    />
                </div>
                <NavBar />
                <div className="container py-8 mt-10 max-w-full">
                    <h1 className="text-2xl font-bold mb-4 flex justify-center">Welcome to {userData.name}&apos;s Profile!</h1>
                    <div className="text-xl font-bold mb-4 flex justify-center">
                        <h2>@{userData.username}</h2>
                    </div>
                </div>
                <div>
                    {userData ? <Image
                        src={userData.imageProfile}
                        alt=""
                        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '-1', borderRadius: 400 / 2 }}
                        onClick={() => document.getElementById('fileInput').click()}
                        width={190}
                        height={190}
                    /> : <Image
                        src={"https://i.imgur.com/GFyNyVE_d.webp?maxwidth=760&fidelity=grand"}
                        alt=""
                        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '-1', borderRadius: 400 / 2 }}
                        width={190}
                        height={190}
                        onClick={() => document.getElementById('fileInput').click()}
                    />}
                </div>
            </div>
        );
    } else {
        return (
            <NotLoggedIn />
        );
    }
};

export default ProfilePage;
