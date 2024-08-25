import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { isLoggedIn, logout } from '../utils/auth';
import '../assets/styles/ProfilePage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2'; 

const ProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        Name: '',
        Surname: '',
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn()) {
                try {
                    setLoading(true); 
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`https://localhost:7264/api/Account/GetUsersDetails?id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                    setFormData({
                        Name: response.data.name || '',
                        Surname: response.data.surname || '',
                        OldPassword: '',
                        NewPassword: '',
                        ConfirmPassword: '',
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    const errorMessage = error.response?.data?.message || 'An error occurred while fetching user details.';
                    setError(errorMessage);
                    navigate('/');
                } finally {
                    setLoading(false); 
                }
            } else {
                navigate('/login');
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); 
            const token = localStorage.getItem("token");
            await axios.put(`https://localhost:7264/api/Account/UpdateProfile?id=${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, ...formData });
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while updating profile.';
            setError(errorMessage);
        } finally {
            setLoading(false); 
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                setLoading(true); 
                const token = localStorage.getItem("token");
                await axios.delete(`https://localhost:7264/api/Account/DeleteAccount?userId=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                logout();
                Swal.fire({
                    icon: 'success',
                    title: 'Account deleted successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/');
                });
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'An error occurred while deleting account.';
                setError(errorMessage);
            } finally {
                setLoading(false); 
            }
        }
    };

    return (
        <section>
            <Navbar user={user} />
            <div className="container bootstrap snippets bootdey p-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="personal-info">
                            <h3>Personal Info</h3>
                            <p><strong>First Name:</strong> {user.name}</p>
                            <p><strong>Last Name:</strong> {user.surname}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Subscription Type:</strong> {user.subscriptionType}</p>
                            <p><strong>Roles:</strong> {user.roles?.join(', ')}</p>
                        </div>
                    </div>
                    <div className="col-md-8">
                        {error && (
                            <div className="alert alert-danger">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                        {loading ? ( 
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3>Update Your Information</h3>
                                <form className="form-horizontal" onSubmit={handleUpdate}>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">First Name:</label>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="Name"
                                                value={formData.Name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">Last Name:</label>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="Surname"
                                                value={formData.Surname}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">Old Password:</label>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="OldPassword"
                                                value={formData.OldPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">New Password:</label>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="NewPassword"
                                                value={formData.NewPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">Confirm Password:</label>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="ConfirmPassword"
                                                value={formData.ConfirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-lg-8 col-lg-offset-3">
                                            <button type="submit" className="btn btn-primary">Update Profile</button>
                                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default ProfilePage;
