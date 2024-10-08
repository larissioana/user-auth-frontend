import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profilePage.css';
import avatar from '../../assets/user-avatar.png';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editableProfile, setEditableProfile] = useState({
        name: "",
        email: "",
        profileImage: ""
    });
    const [imageSrc, setImageSrc] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError("");

            const cachedProfile = localStorage.getItem("userProfile");
            if (cachedProfile) {
                const parsedProfile = JSON.parse(cachedProfile);
                setUserProfile(parsedProfile);
                setEditableProfile({
                    name: parsedProfile.name,
                    email: parsedProfile.email,
                    profileImage: parsedProfile.profileImage || "",
                });
            }

            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    setError("No token found. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://user-auth-backend-91ue.onrender.com/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setUserProfile(response.data);
                setEditableProfile({
                    name: response.data.name,
                    email: response.data.email,
                    profileImage: response.data.profileImage || "",
                });

                localStorage.setItem("userProfile", JSON.stringify(response.data));
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data.message : "Failed to fetch profile data");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (userProfile && userProfile.profileImage) {
            const imgPath = `https://user-auth-backend-91ue.onrender.com/${userProfile.profileImage}`;
            setImageSrc(imgPath);

            const img = new Image();
            img.src = imgPath;
            img.onload = () => {
                setImageLoaded(true);
            };
        }
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableProfile((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditableProfile((prevState) => ({
                ...prevState,
                profileImage: file,
            }));
            setImageSrc(URL.createObjectURL(file));
            setImageLoaded(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', editableProfile.name);
        formData.append('email', editableProfile.email);
        if (editableProfile.profileImage) {
            formData.append('profileImage', editableProfile.profileImage);
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put('https://user-auth-backend-91ue.onrender.com/api/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserProfile(response.data);
            localStorage.setItem("userProfile", JSON.stringify(response.data));
            setLoading(false);
        } catch (error) {
            setError(error.response ? error.response.data.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loader-container">
            <p className="loader"></p>
        </div>
    }

    if (error) {
        return <p className="error" style={{ fontSize: "2rem" }}>{error}</p>;
    }

    const imageUrl = imageSrc || avatar;

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userProfile");
        setUserProfile(null);
        setEditableProfile({
            name: "",
            email: "",
            profileImage: ""
        });
        navigate("/");
    };


    return (
        <div className="profile-container">
            <h1 className="update-profile">Update your profile.</h1>
            <form onSubmit={handleSubmit}>
                <div className="user-profile">
                    <div className="profile-image">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            id="profile-image-upload"
                        />
                        <label htmlFor="profile-image-upload" className="profile-image-label">
                            <img
                                src={imageUrl}
                                className="user-profile-avatar"
                                alt="Profile"
                                style={{ opacity: imageLoaded ? 1 : 0.5, transition: 'opacity 0.3s ease' }}
                            />
                            <p className="select">Click here to select an image</p>
                        </label>
                    </div>
                    <div className="profile-info">
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                className="profile-input"
                                placeholder={userProfile.name}
                                value={editableProfile.name}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                className="profile-input"
                                value={editableProfile.email}
                                placeholder={userProfile.email}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="profile-btns">
                        <button type="submit" disabled={loading} className="update-btn">
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                        <button onClick={handleLogout} className="sign-out-btn">Sign out</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;