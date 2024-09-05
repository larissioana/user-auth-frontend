import React, { useState } from 'react'
import './login.css';
import FormInput from '../formInput/FormInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setError("");
        setFormData({
            ...formData, [name]: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please fill in both fields");
            return;
        }

        try {
            setError("");
            const response = await axios.post('https://user-auth-backend-91ue.onrender.com/api/user/login', formData, {
                withCredentials: true
            });
            const { token } = response.data;
            if (token) {
                localStorage.setItem("authToken", token);
                localStorage.removeItem("userProfile");
                navigate("/profile");
            } else {
                console.error("No token received");
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : "An unexpected error occurred")
        }
    };

    return (
        <div className="login">
            <FormInput
                type="text"
                placeholder={"Email"}
                name="email"
                value={formData.email}
                handleChange={handleChange}
            />
            <FormInput
                type="password"
                placeholder={"Password"}
                name="password"
                value={formData.password}
                handleChange={handleChange}
            />
            {
                error &&
                <p className="error-message">{error}</p>
            }
            <button className="auth-btn" type="submit" onClick={onSubmit}>Sign in</button>
        </div>
    )
}

export default Login
