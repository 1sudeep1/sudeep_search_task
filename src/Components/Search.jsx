import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./search.scss"

const Search = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const inputRef = useRef();

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setSearchQuery('');
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handlePriceFilterChange = (e) => {
        setPriceFilter(e.target.value);
    };

    const handleSearch = () => {
        axios.get('https://fakestoreapi.com/products')
            .then((response) => {
                let filteredResults = response.data;
                if (searchQuery) {
                    filteredResults = filteredResults.filter((product) =>
                        product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                if (categoryFilter !== 'all') {
                    filteredResults = filteredResults.filter((product) => product.category === categoryFilter);
                }
                if (priceFilter !== 'all') {
                    const [minPrice, maxPrice] = priceFilter.split('-');
                    filteredResults = filteredResults.filter((product) => product.price >= parseInt(minPrice) && product.price <= parseInt(maxPrice)
                    );
                }
                setSearchResults(filteredResults);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleClear = () => {
        setShowSearch(false);
        setSearchQuery('');
        setCategoryFilter('all');
        setPriceFilter('all');
        setSearchResults([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSearch(false);
            setSearchQuery('');
            setCategoryFilter('all');
            setPriceFilter('all');
            setSearchResults([]);
        }
        if (e.ctrlKey && e.key === 'm') {
            setShowSearch(!showSearch);
            setSearchQuery('');
        }
    };

    const handleClickOutside = (e) => {
        if (inputRef.current && !inputRef.current.contains(e.target)) {
            setShowSearch(false);
            setSearchQuery('');
            setCategoryFilter('all');
            setPriceFilter('all');
            setSearchResults([]);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="input-group mt-2 mb-2 gap-3" ref={inputRef}>
                        {showSearch && (
                            <>
                                <input type="text" className="form-control" placeholder="Search here..." value={searchQuery} onChange={handleInputChange} />
                                <select className="form-control" value={categoryFilter} onChange={handleCategoryFilterChange}>
                                    <option value="all">All Categories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="jewelery">Jewelery</option>
                                    <option value="men's clothing">Men's Clothing</option>
                                    <option value="women's clothing">Women's Clothing</option>
                                </select>

                                <select className="form-control" value={priceFilter} onChange={handlePriceFilterChange}>
                                    <option value="all">All Prices</option>
                                    <option value="0-10">$0 - $50</option>
                                    <option value="10-20">$50 - $100</option>
                                    <option value="20-30">$100 - $200</option>
                                    <option value="30-40">$200 - $1000</option>
                                </select>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleClear}>
                                        close X
                                    </button>
                                </div>
                            </>
                        )}
                        {!showSearch && (
                            <button className="search-btn" onClick={toggleSearch}>
                                Search
                                <i className="bi bi-search"></i>
                                <span className='ctrlm'>Ctrl+M</span>
                            </button>
                        )}
                        {showSearch && (
                            <div className="input-group-append">
                                <button className="btn btn-primary" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                    {searchResults.length > 0 && (
                        <ul className="list-group mt-3">
                            {searchResults.map((product) => (
                                <li className="list-group-item" key={product.id}>
                                    {product.title}
                                </li>
                            ))}
                        </ul>
                    )}
                    {searchResults.length === 0 && showSearch && (
                        <p>No matching products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
