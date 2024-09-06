import React, { useState } from 'react'
import FormInput from '../formInput/FormInput'
import axios from 'axios';

const Register = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setFormData({
            ...formData, [name]: value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            setError("");
            const response = await axios.post('https://user-auth-backend-91ue.onrender.com/api/user/register', formData, {
                withCredentials: true
            });
            if (response.status === 201) {
                setAuth("login");
            }

        } catch (error) {
            setError(error.response ? error.response.data.message : "An unexpected error occurred");
        }
    };

    return (
        <div>
            <div className="login">
                <FormInput
                    type="text"
                    name="name"
                    value={formData.name}
                    handleChange={handleChange}
                    placeholder={"Name"}
                />
                <FormInput
                    type="text"
                    name="email"
                    value={formData.email}
                    handleChange={handleChange}
                    placeholder={"Email"}
                />
                <FormInput
                    type="password"
                    name="password"
                    value={formData.password}
                    handleChange={handleChange}
                    placeholder={"Password"}
                />
                {
                    error &&
                    <p className="error-message">{error}</p>
                }
                <button className="auth-btn" type="submit" onClick={onSubmit}>Sign up</button>
            </div>
        </div>
    )
}

export default Register
