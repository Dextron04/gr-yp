import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const { isLoggedIn } = props
    }
};

export default withAuth;
