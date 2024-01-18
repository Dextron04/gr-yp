import React from 'react';

const Logo = () => {
    return (
        <svg viewBox="0 0 100 40" width="8000" height="200">
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
            <text textAnchor="middle" x="50" y="15" fontSize="20" fill="white" fillOpacity="0.7">GRYP</text>
            <text textAnchor="middle" x="50" y="15" fontSize="20" fill="url(#wave)" fillOpacity="1">GRYP</text>
        </svg>
    );
};

export default Logo;
