import React from 'react';
import NavBar from '../components/NavBar';
import { useSession } from 'next-auth/react';
import AtomicSpinner from 'atomic-spinner';
import Image from 'next/image';

const ProfilePage = () => {
    const { data: session } = useSession();

    return (
        <div>

            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '-1' }}>
                <AtomicSpinner
                    atomSize={500}
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
                <h1 className="text-4xl font-bold mb-4 flex justify-center">Welcome {session?.user?.name}!</h1>
                {/* Add your profile content here */}
            </div>
            <Image
                src={"https://i.imgur.com/GFyNyVE_d.webp?maxwidth=760&fidelity=grand"}
                alt=""
                style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '-1', borderRadius: 400 / 2 }}
                width={310}
                height={310}
            />
        </div>
    );
};

export default ProfilePage;
