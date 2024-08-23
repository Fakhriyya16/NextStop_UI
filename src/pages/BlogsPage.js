import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/Blogs.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';


const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(3);
    const [loading, setLoading] = useState(true);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBlogs(currentPage, pageSize);
    }, [currentPage]);

    const fetchBlogs = async (currentPage, pageSize) => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:7264/api/Blog/GetPaginatedBlogs', {
                params: { currentPage, pageSize }
            });
            const data = response.data;
            setBlogs(data.data || []);
            setHasNext(data.hasNext);
            setHasPrevious(data.hasPrevious);
            setTotalPages(data.pageCount);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
        setLoading(false);
    };

    const shortenDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    };

    const nextPage = () => {
        if (hasNext) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (hasPrevious) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <section id='blogs'>
            <Navbar />
            <h1 className='blogs-heading'>Explore Travel Blogs</h1>
            <div className="go-back-b">
                <a className="go-back-b-a" href="/">
                    <i className="fas fa-chevron-left"></i>
                </a>
                <a className="go-back-b-a" href="/">
                    Go Back
                </a>
            </div>
            <div className="blog-container">
                {loading ? (
                    <p>Loading blogs...</p>
                ) : (
                    blogs.map((blog) => (
                        <div className="post" key={blog.id}>
                            <div className="header_post">
                                <img src={blog.images[0]} alt={blog.title} />
                            </div>
                            <div className="body_post">
                                <div className="post_content">
                                    <h1>{blog.title}</h1>
                                    <p>{shortenDescription(blog.content, 10)}</p>
                                    <Link to={`/blog/${blog.id}`} className="b-btn b-btn--with-icon">
                                        <i className="b-btn-icon fa fa-long-arrow-right"></i> READ MORE
                                    </Link>
                                    <div className="container_infos">
                                        <div className="postedBy">
                                            <span>Author</span>
                                            {blog.author}
                                        </div>
                                        <div className="container_date">
                                            <span>Publish Date</span>
                                            <div className="date">
                                                <span>{blog.publishDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="b-pagination">
                <button onClick={prevPage} disabled={!hasPrevious}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={!hasNext}>
                    Next
                </button>
            </div>
            <Footer />
        </section>
    );
};

export default BlogPage;
