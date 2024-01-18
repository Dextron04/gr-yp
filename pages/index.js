import React from "react";
import styles from '../styles/index.module.css'
import Login from "../components/login";
import Logo from "../components/logo";
import { signOut, useSession } from "next-auth/react";

export default function Index() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div>
                <div>Welcome, {session.user.name}!</div>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );
    } else {
        return (
            <div>
                <div className={styles.head}>
                    <div>Not signed in</div>
                    <Logo />
                </div>
                <div className={styles.login}>
                    <Login />
                </div>

            </div>
        );
    }
}
