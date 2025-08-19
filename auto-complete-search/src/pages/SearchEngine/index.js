import React, { useState, useCallback, useRef } from 'react';
import styles from './styles.module.css';
import axios from 'axios';

const SearchEngine = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([])
    const [autoCompleteText, setAutoCompleteText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const apiUrl = 'https://api.duckduckgo.com/'

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    const autoSuggestion = async (value) => {
        if(!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            setAutoCompleteText('');
            return
        }
        try {
            const suggestionUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(value)}&limit=8&namespace=0&format=json&origin=*`;
            const response = await axios.get(suggestionUrl);
            if(response?.status === 200) {
                console.log(response?.data[1],"dgvwhv")
                setSuggestions(response?.data[1]);
                setShowSuggestions(response?.data[1].length > 0);
                
                // Set autocomplete text from first suggestion
                if (response?.data[1].length > 0) {
                    const secondSuggestion = response?.data[1][0];
                    if (secondSuggestion.toLowerCase().startsWith(value.toLowerCase())) {
                        setAutoCompleteText(secondSuggestion);
                    } else {
                        setAutoCompleteText('');
                    }
                } else {
                    setAutoCompleteText('');
                }
            }
        } catch (error){
            console.log(error)
        }
    }

    // Create debounced version of autoSuggestion with 300ms delay
    const debouncedAutoSuggestion = useCallback(
        debounce(autoSuggestion, 300),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setAutoCompleteText('');
        debouncedAutoSuggestion(value);
    }

    const selectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setAutoCompleteText('');
        inputRef.current?.focus();
    }

    const handleSuggestionClick = (suggestion) => {
        selectSuggestion(suggestion);
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
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                if (autoCompleteText && autoCompleteText !== searchTerm) {
                    setSearchTerm(autoCompleteText);
                    setAutoCompleteText('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
                break;
            
            case 'Enter':
                if (autoCompleteText && autoCompleteText !== searchTerm) {
                    setSearchTerm(autoCompleteText);
                    setAutoCompleteText('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                } else {
                    fetchSearchResult();
                }
                break;
            
            case 'Escape':
                setShowSuggestions(false);
                setAutoCompleteText('');
                break;
            
            case 'ArrowRight':
                // Accept autocomplete on right arrow
                if (autoCompleteText && autoCompleteText !== searchTerm) {
                    e.preventDefault();
                    setSearchTerm(autoCompleteText);
                    setAutoCompleteText('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
                break;
            
            default:
                break;
        }
    }

  return (
    <div className={styles.container}>
      <h1>Search Engine</h1>
      <div className={styles.searchBox}>
        <div className={styles.inputContainer}>
          <input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              className={styles.searchInput}
              value={`${searchTerm}`}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
          />
          {autoCompleteText && autoCompleteText !== searchTerm && (
            <div className={styles.autoCompleteOverlay}>
              <span className={styles.typedText}>{searchTerm}</span>
              <span className={styles.suggestedText}>
                {autoCompleteText.slice(searchTerm.length)}
              </span>
            </div>
          )}
        </div>
        {showSuggestions && suggestions?.length > 0 && <ul className={styles.suggestionsList}>
            {suggestions?.map((item, index) => {
                return (
                    <li 
                        key={index} 
                        className={styles.listItem}
                        onClick={() => handleSuggestionClick(item)}
                    >
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