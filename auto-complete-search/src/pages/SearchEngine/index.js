import React, { useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';

const SearchEngine = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([])
    const apiUrl = 'https://api.duckduckgo.com/'

    const autoSuggestion = async (value) => {
        if(!value.trim()) {
            setSuggestions([]);
            return
        }
        try {
            const suggestionUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(value)}&limit=8&namespace=0&format=json&origin=*`;
            const response = await axios.get(suggestionUrl);
            if(response?.status === 200) {
                console.log(response?.data[1],"dgvwhv")
                setSuggestions(response?.data[1]);
            }
        } catch (error){
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        autoSuggestion(e.target.value)
    }

    const fetchSearchResult = async () => {
        const response = await axios.get(apiUrl, {
            params: {
                q: searchTerm,
                format: 'json',
            }
        });
        console.log(response,"reposne")
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            fetchSearchResult()
        }
    }

  return (
    <div className={styles.container}>
      <h1>Search Engine</h1>
      <div className={styles.searchBox}>
        <input
            type="text"
            placeholder="Type to search..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
        {suggestions?.length > 0 && <ul className={styles.suggestionsList}>
            {suggestions?.map((item, index) => {
                return (
                    <li key={index} className={styles.listItem}>
                        <img src='https://icon-library.com/images/search-icon/search-icon-7.jpg' className={styles.searchImg} alt='arrow'/>
                        {item}
                    </li>
                )
            })}
        </ul>}
      </div>
    </div>
  )
}

export default SearchEngine
