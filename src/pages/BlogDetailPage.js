import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/BlogDetail.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`https://localhost:7264/api/Blog/GetById/${id}`);
                setBlog(response.data);
                console.log(blog);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!blog) {
        return <p>Blog not found</p>;
    }

    return (
        <section className="detail-page-blog">
            <Navbar />
            <div className="detail-blog-main">
                <Link to="/blogs" className="back-btn">
                    &larr; Back to Blogs
                </Link>
                
                <article className="blog-card-detail">
                    <div className="card__background--wrapper">
                        <img src={blog.images[0]} className='blog-detail-image' alt="Blog Detail" />
                    </div>
                    <div className="blog-card-detail__info">
                        <h5 className='blog-detail-heading'>{blog.title}</h5>
                        <p>
                            <a className="blog-detail-a"> {blog.author}</a>
                            <a className="blog-detail-a">{blog.publishDate}</a>
                        </p>
                        <p className='blog-detail-content'>{blog.content}</p>
                    </div>
                </article>
            </div>
            <Footer />
        </section>
    );
};

export default BlogDetail;
