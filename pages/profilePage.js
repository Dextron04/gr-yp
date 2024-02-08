import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useSession } from 'next-auth/react';
import AtomicSpinner from 'atomic-spinner';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NotLoggedIn from '../components/notLoggedIn';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfilePage = () => {
    const { data: session } = useSession();
    const [imageProfile, setImageProfile] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');


    // Used to fetch username from the database
    useEffect(() => {
        if (session) {
            const fetchUsername = async () => {
                try {
                    const response = await fetch('/api/getUsername', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userEmail: session.user.email
                        })
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        const username = data;
                        setUsername(username);
                    } else {
                        console.log('Something went wrong');
                    }
                } catch (e) {
                    console.error(`Error! ${e}`);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchUsername();
        }
    });

    useEffect(() => {
        if (session) {
            // console.log(session);
            const fetchProfileImage = async () => {
                try {
                    const response = await fetch('/api/getProfileImage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userEmail: session.user.email
                        })
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        setImageProfile(data.profilePhoto);
                    } else {
                        console.log('Something went wrong');
                    }
                } catch (e) {
                    console.error(`Error! ${e}`);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchProfileImage();
        }
    });


    if (isLoading) {
        return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div><AtomicSpinner atomSize={300} electronSize={2.5} /></div>
        </div>)
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
                setImageProfile(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        // console.log(file);

        if (file) {
            const base64 = await convertToBase64(file);
            try {
                const response = await fetch('/api/updateProfileImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageProfile: base64,
                        userEmail: session.user.email
                    })
                });

                if (response.status === 201) {
                    console.log('Update was successful');
                    toast.success("Profile updated successfully!");
                    setImageProfile('');
                    window.location.reload();
                } else {
                    console.log('Something went wrong');
                }
            } catch (e) {
                console.error(`Error! ${e}`);
            }
        }
    };

    const handleUsernameChange = async (event) => {

        setNewUsername(event.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUsernameSubmit = async () => {
        // Submit the new username to the server
        if (newUsername.length > 3) {
            try {
                const response = await fetch('/api/setUsername', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        newUsername: newUsername,
                        username: username,
                    })
                });

                if (response.status === 201) {
                    console.log('Update was successful');
                    toast.success("Profile updated successfully!");
                    setNewUsername('');
                    window.location.reload();
                } else {
                    console.log('Something went wrong');
                }
            } catch (e) {
                console.error(`Error! ${e}`);
            }
        } else {
            toast.warn("Username must be at least 10 characters long!")
        }



        // Exit edit mode
        setIsEditing(false);
    };

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
                    <h1 className="text-2xl font-bold mb-4 flex justify-center">Welcome {session?.user?.name}!</h1>
                    {isEditing ? (
                        <div className="text-xl font-bold mb-4 flex justify-center">
                            <input className='bg-black outline-gray-200 outline-dashed rounded-lg mr-3' type="text" value={newUsername} onChange={handleUsernameChange} />
                            <button onClick={handleUsernameSubmit}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="text-xl font-bold mb-4 flex justify-center">
                            <h2>{username}</h2>
                            <button className='flex justify-center ml-2' onClick={handleEditClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    {imageProfile ? <Image
                        src={imageProfile}
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
                    <input
                        id='fileInput'
                        style={{ display: 'none' }}  // Make room for the icon
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleFileUpload(e)}
                    />
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
