import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../assets/styles/WriteBlogPage.css';
import Swal from 'sweetalert2';
import { isLoggedIn, getUser } from '../utils/auth';

const WriteBlogPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        if (isLoggedIn()) {
            const userDetails = await getUser();
            setUser(userDetails);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleImageChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoggedIn()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You need to be logged in to write a blog.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Content', content);
        formData.append('AppUserId', user.appUserId);

        for (let i = 0; i < images.length; i++) {
            formData.append('Images', images[i]);
        }

        try {
            await axios.post('https://localhost:7264/api/Blog/Create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Blog created successfully!',
            });

            setTitle('');
            setContent('');
            setImages([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error creating blog. Please try again.',
            });
        }
    };

    return (
        <section id='write-blog'>
            <Navbar user={user} />
            <div className='write-blog-page-content'>
                <h1 className='write-blog-heading'>Write a New Blog</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className='write-blog-form'>
                    <div className="write-blog-form-group form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="write-blog-form-group form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="write-blog-form-group form-group">
                        <label htmlFor="images">Images</label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className='write-blog-button' type="submit">Submit</button>
                </form>
            </div>
            <Footer />
        </section>
    );
};

export default WriteBlogPage;
