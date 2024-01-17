import React from 'react';
import App from 'next/app';
import '../styles/global.css'
import Footer from '../components/footer';
import { ToastContainer } from 'react-toastify';
import { Bounce } from 'react-toastify';

function Gryp({ Component, pageProps }) {
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
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default Gryp;
