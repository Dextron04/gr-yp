import React from "react";
import styles from '../styles/index.module.css'
import Login from "../components/login";
import Image from "next/image";
import Logo from "../components/logo";

export default function Index() {
    return (
        <div>
            <div className={styles.head}>
                <Logo />
            </div>
            <div className={styles.login}>
                <Login />
            </div>

        </div>
    );
}
