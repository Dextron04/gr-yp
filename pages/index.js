import React from "react";
import styles from '../styles/index.module.css'
import Login from "../components/login";
import Logo from "../components/logo";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Index() {
    const { data: session } = useSession()
    const router = new useRouter()

    if (session) {
        console.log(session.user.name);
        // console.log(session.user.email);
        console.log(session.user.image);
        console.log(session.expires);
        toast.success("Sign In Successful")
        router.push('/home')
    } else {
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
}
