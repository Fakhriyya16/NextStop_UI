import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/styles/BlogCarousel.css';
import { Link } from 'react-router-dom';

const BlogCarousel = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('https://localhost:7264/api/Blog/GetAll');
            setBlogs(response.data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div>
            <div className='mp-blog-carousel-heading'>
                <h1>Recent Blogs</h1>
            </div>
            <div className="mp-blog-center">
                <div className="mp-blog-wrapper">
                    <Slider {...settings}>
                        {blogs.map((blog) => (
                            <Link to={`/blog/${blog.id}`}>
                                <div key={blog.id} className="mp-blog-card-crs">
                                    <img src={blog.images[0]} alt={blog.title} />
                                    <div className="mp-blog-content-b">
                                        <h1>{blog.title}</h1>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default BlogCarousel;
