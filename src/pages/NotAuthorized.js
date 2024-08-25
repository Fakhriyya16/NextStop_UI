import React from 'react';
import '../assets/styles/NotAuthorized.css'

const NotAuthorized = () => {
    return (
        <section id='notauthorized'>
            <div className="na-text-wrapper">
                <div className="na-title" data-content="403">
                    403 - ACCESS DENIED
                </div>

                <div className="na-subtitle">
                    Oops, You don't have permission to access this page.
                </div>
                <div className="na-buttons">
                    <a className="na-button" href="/">Go to homepage</a>
                </div>
            </div>
        </section>
    );
};

export default NotAuthorized;


