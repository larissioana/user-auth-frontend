import React, { useEffect, Suspense, lazy } from 'react'
import contactImg from '../../assets/contact.png';
import './auth.css';
import Login from '../login/Login';
import Register from '../register/Register';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const LazyComponent = lazy(() => import('../login/Login'));

const Auth = ({ auth, setAuth }) => {

    const handleAuth = (type) => {
        setAuth(type);
    };

    useEffect(() => {
        const preloadImage = (src) => {
            const img = new Image();
            img.src = src;
        };

        preloadImage(contactImg);
    }, []);


    return (
        <div className="auth-container">
            <div className="auth-left">
                <LazyLoadImage effect="blur" width="100%" height="100%" src={contactImg} alt="contact" />
            </div>
            <div className="auth-right">
                <div className="auth-container-btns">
                    <button
                        className="auth-btns"
                        onClick={() => handleAuth("register")}
                        style={{
                            borderTop: auth === "register" ? "2px solid #111" : ""
                        }}
                    >
                        Sign up
                    </button>
                    <button
                        className="auth-btns"
                        style={{
                            borderTop: auth === "login" ? "2px solid #111" : ""
                        }}
                        onClick={() => handleAuth("login")}
                    >
                        Sign in
                    </button>
                </div>
                {
                    auth === "login" ?
                        <form className="auth-form">
                            <Suspense fallback={<div>Loading...</div>}>
                                <h1>Login</h1>
                            </Suspense>
                            <LazyComponent />
                        </form>
                        :
                        <form className="auth-form">
                            <h1>Register</h1>
                            <Register setAuth={setAuth} />
                        </form>
                }
            </div>
        </div>
    )
}

export default Auth
