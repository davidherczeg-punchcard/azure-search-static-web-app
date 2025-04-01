import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Box } from '@mui/material';
import axios from '../../axios.js';

export default function SearchBar2({ postSearchHandler, query }) {
  const [q, setQ] = useState(() => query || '');
  const [suggestions, setSuggestions] = useState([]);

  const search = (value) => {
    console.log(`search: ${value}`);
    postSearchHandler(value);
  };

  useEffect(() => {
    console.log(`useEffect getSuggestions: ${q}`);
    if (q) {
      axios.post('/api/suggest', { q, top: 5, suggester: 'sg' })
      .then(response => {
          setSuggestions(response.data.suggestions.map(s => s.text));
      }).catch (error =>{
          console.log(error);
          setSuggestions([]);
        });
}}, [q]);


  const onInputChangeHandler = (event, value) => {
    console.log(`onInputChangeHandler: ${value}`);
    setQ(value);
  };


  const onChangeHandler = (event, value) => {
    console.log(`onChangeHandler: ${value}`);
    setQ(value);
    search(value);
  };

  const onEnterButton = (event) => {
    console.log(`onEnterButton: ${q}`);
    // if enter key is pressed
    if (event.key === 'Enter') {
      search(q);
    }
  };

  return (
    <div
      className="input-group"
      style={{ width: '95%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '75%', minWidth: '390px' }}>
      <Autocomplete
        freeSolo
        value={q}
        options={suggestions}
        onInputChange={onInputChangeHandler}
        onChange={onChangeHandler}
        disableClearable
        sx={{
          width: '75%',
          '& .MuiAutocomplete-endAdornment': {
            display: 'none'
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            id="search-box"
            className="form-control rounded-0"
            placeholder="What are you looking for?"
            onBlur={() => setSuggestions([])}
            onClick={() => setSuggestions([])}
          />
        )}
      />
      <div className="input-group-btn" style={{ marginLeft: '10px' }}>
        <Button variant="contained" color="primary" onClick={() => {
          console.log(`search button: ${q}`);
          search(q)}
          }>
          Search
        </Button>
      </div>
      </Box>
    </div>
  );
}