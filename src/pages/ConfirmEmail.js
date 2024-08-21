import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/ConfirmEmail.css';

const ConfirmEmail = () => {
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('userId');
        const token = queryParams.get('token');

        const confirmEmail = async () => {
            try {
                const response = await axios.get(`https://localhost:7264/api/Account/ConfirmEmail`, {
                    params: { userId, token }
                });

                if (response.status === 200) {
                    setMessage('Your email has been confirmed successfully.');
                    setIsSuccess(true);
                } else {
                    setMessage('There was an issue confirming your email.');
                    setIsSuccess(false);
                }
            } catch (error) {
                setMessage('An error occurred during the email confirmation process.');
                setIsSuccess(false);
            }
        };
        confirmEmail();
    }, [location]);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <section className='ce'>
            <div className="ce-card">
                <div
                    style={{
                        borderRadius: '200px',
                        height: '200px',
                        width: '200px',
                        background: '#F8FAF5',
                        margin: '0 auto',
                    }}
                >
                    <i className="ce-checkmark">{isSuccess ? '✓' : '!'}</i>
                </div>
                <h1 className='ce-heading'>{isSuccess ? 'Success' : 'Oops!'}</h1>
                <p className='ce-message'>
                    {isSuccess
                        ? 'Your email has been confirmed successfully!'
                        : 'There was an issue confirming your email.'}
                </p>
                {isSuccess && (
                    <button className="ce-button" onClick={handleLoginRedirect} style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px', cursor: 'pointer' }}>
                        Go to Login
                    </button>
                )}
            </div>
        </section>
    );
};

export default ConfirmEmail;
