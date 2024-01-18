import React from 'react';
import App from 'next/app';
import '../styles/global.css'
import Footer from '../components/footer';
import { ToastContainer, Bounce } from 'react-toastify';
import { SessionProvider, useSession } from "next-auth/react";
import 'react-toastify/dist/ReactToastify.css';

function Gryp({ Component, pageProps: { session, ...pageProps } }) {
    // Add any custom logic or components here

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
            <Footer />
        </>
    );
}

export default Gryp;
