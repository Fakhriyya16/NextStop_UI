import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/styles/SearchPlaces.css";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { isLoggedIn, getUser } from '../utils/auth';
import { Nav } from "reactstrap";

const SearchPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortProperty, setSortProperty] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [user, setUser] = useState(null);
  const pageSize = 10;

  const fetchUser = async () => {
    if (isLoggedIn()) {
      const userDetails = await getUser();
      setUser(userDetails);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchPlaces();
    fetchCategories();
    fetchCities();
    fetchTags();
  }, [currentPage, searchText, selectedCategory, selectedCity, selectedTag, sortProperty, sortOrder]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      let url = `https://localhost:7264/api/Place/GetAllPaginated?currentPage=${currentPage}&pageSize=${pageSize}`;

      if (searchText) {
        url = `https://localhost:7264/api/Place/SearchByName?searchText=${searchText}&currentPage=${currentPage}&pageSize=${pageSize}`;
      } else if (selectedCategory) {
        url = `https://localhost:7264/api/Place/FilterByCategory?category=${selectedCategory}&currentPage=${currentPage}&pageSize=${pageSize}`;
      } else if (selectedCity) {
        url = `https://localhost:7264/api/Place/FilterByCity?city=${selectedCity}&currentPage=${currentPage}&pageSize=${pageSize}`;
      } else if (selectedTag) {
        url = `https://localhost:7264/api/Place/FilterByTag?tag=${selectedTag}&currentPage=${currentPage}&pageSize=${pageSize}`;
      } else if (sortProperty) {
        url = `https://localhost:7264/api/Place/SortBy?property=${sortProperty}&order=${sortOrder}&currentPage=${currentPage}&pageSize=${pageSize}`;
      }

      const response = await axios.get(url);
      console.log("Fetched Data:", response.data);

      setPlaces(response.data.data || response.data);
      setTotalPages(response.data.pageCount || 1);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching places:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/Category/GetAllNames");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/City/GetAllNames");
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/Tag/GetAllNames");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedTag("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedCity("");
    setSelectedTag("");
    setSearchText("");
    setCurrentPage(1);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedCategory("");
    setSelectedTag("");
    setSearchText("");
    setCurrentPage(1);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setSelectedCategory("");
    setSelectedCity("");
    setSearchText("");
    setCurrentPage(1);
  };

  const handleSortChange = (property) => {
    setSelectedCategory("");
    setSelectedCity("");
    setSearchText("");
    setSelectedTag("");
    if (sortProperty === property) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortProperty(property);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <section>
      <Navbar user={user} />
      <div className="search-place-container">
        <div className="search-filter-sort-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={handleSearch}
            className="search-input"
          />
          <select value={selectedCategory} onChange={handleCategoryChange} className="filter-select">
            <option value="">Filter by Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <select value={selectedCity} onChange={handleCityChange} className="filter-select">
            <option value="">Filter by City</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>{city.name}</option>
            ))}
          </select>
          <select value={selectedTag} onChange={handleTagChange} className="filter-select">
            <option value="">Filter by Tag</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
          <div className="sort-dropdown">
            <button onClick={() => handleSortChange("date")} className="sort-button ">
              Sort by Date {sortProperty === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            <button onClick={() => handleSortChange("rating")} className="sort-button mx-3">
              Sort by Rating {sortProperty === "rating" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="places-grid">
              {places.length > 0 ? (
                places.map((place) => (
                  <div key={place.id} className="place-card">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="place-image"
                    />
                    <div className="place-info">
                      <h3>{place.name}</h3>
                    </div>
                    <div className="place-hover-overlay">
                      <Link
                        to={`/place/${place.id}`}
                        className="read-more-button"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No places found.</p>
              )}
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default SearchPlaces;
