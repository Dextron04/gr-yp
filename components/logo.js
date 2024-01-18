import React from 'react';
import styles from '../styles/logo.module.css'

const Logo = () => {
    return (
        <div className={styles.logo}>
            <svg viewBox="0 0 100 40" width="1000" height="800" >
                <defs>
                    <linearGradient id="gradient">
                        <stop color="#000" />
                    </linearGradient>
                    <pattern id="wave" x="0" y="-0.5" width="100%" height="100%" patternUnits="userSpaceOnUse">
                        <path id="wavePath" d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" mask="url(#mask)" fill="url(#gradient)">
                            <animateTransform
                                attributeName="transform"
                                begin="0s"
                                dur="1.5s"
                                type="translate"
                                from="0,0"
                                to="40,0"
                                repeatCount="indefinite" />
                        </path>
                    </pattern>
                </defs>
                <text textAnchor="middle" x="50" y="15" fontSize="30" fill="white" fillOpacity="0.7">GRYP</text>
                <text textAnchor="middle" x="50" y="15" fontSize="30" fill="url(#wave)" fillOpacity="1">GRYP</text>
            </svg>
        </div>
    );
};

export default Logo;
