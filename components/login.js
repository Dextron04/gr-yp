import styles from '../styles/login.module.css'
import { React, use, useState } from "react";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Login = () => {

    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    // Will change the login page to sign up page
    const handleSignupClick = (event) => {
        event.preventDefault();
        setPassword('');
        setUsername('');
        setIsSignup(true);
    };

    // Will change the login page to log in page
    const handleLoginClick = (event) => {
        event.preventDefault();
        setPassword('');
        setUsername('');
        setIsSignup(false);
    };

    // Will initiate the sign up process and will store new user data to the database
    const handleSignUp = async (event) => {
        event.preventDefault();

        if (!username || !password || !email) {
            toast("Please fill in all the details");
            return;
        }

        if (username.length < 8 || password.length < 8) {
            toast("Username and Password should have at least 8 characters");
            return;
        }

        try {
            const response = await axios.post('/api/saveData', {
                username,
                email,
                password
            });

            if (response.status === 201) {
                console.log('Data Saved successfully');
                setEmail('');
                setPassword('');
                setUsername('');
                toast("Sign Up was successful!");
            } else {
                console.log('Something went wrong');
            }
        } catch (e) {
            console.error(`Error! ${e}`);
        }
    };

    // Will handle login logic and will check the database for the user.
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/LogIn', {
                username,
                password
            });

            if (response.status === 200) {
                setPassword('');
                setUsername('');
                setIsLoggedIn(true)
                toast("Sign In was successful!");

                setTimeout(() => {
                    router.push('/home');
                }, 3000)

                // router.push('/home');
            } else if (response.status === 401) {
                toast("Invalid credentials!");
            } else {
                toast("Login was not successful");
                console.log("Something went wrong");
            }
        } catch (e) {
            toast("Login was not successful")
            console.log(`Error: ${e}`);
        }

    };


    return (
        <div className={styles["form-container"]}>
            {!isSignup && (
                <>
                    <p className={styles["title"]}>Login</p>
                    <form className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <label htmlFor="username">Username</label>
                            <input value={username} type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className={styles["input-group"]}>
                            <label htmlFor="password">Password</label>
                            <input value={password} type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
                            <br />
                            <br />
                        </div>
                        <button onClick={handleLogin} className={styles["sign"]}>Sign in</button>
                    </form>
                    <div className={styles["social-message"]}>
                        <div className={styles["line"]}></div>
                        <p className={styles["message"]}>Login with social accounts</p>
                        <div className={styles["line"]}></div>
                    </div>
                    <p className={styles["signup"]}>
                        Don&apos;t have an account?
                        {' '}
                        <a href="#" className="" onClick={handleSignupClick}>Sign up</a>
                    </p>
                </>
            )}

            {isSignup && (
                <>
                    <p className={styles["title"]}>Sign Up</p>
                    <form className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <label htmlFor="username">Username</label>
                            <input required type="text" name="username" id="username" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className={styles["input-group"]}>
                            <label htmlFor="password">Password</label>
                            <input required type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className={styles["input-group"]}>
                            <label htmlFor="email">Email</label>
                            <input required type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <br />
                        <button onClick={handleSignUp} className={styles["sign"]}>Sign Up</button>
                    </form>
                    <div className={styles["social-message"]}>
                        <div className={styles["line"]}></div>
                        <p className={styles["message"]}>Login with social accounts</p>
                        <div className={styles["line"]}></div>
                    </div>
                    <p className={styles["signup"]}>
                        Already have an account?
                        {' '}
                        <a onClick={handleLoginClick}>Login</a>
                    </p>
                </>
            )}
        </div>
    )
}

export default Login;