const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// News API route
app.get('/api/news', async (req, res) => {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'NewsApp/1.0'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.articles);
  } catch (error) {
    console.error('Detailed Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news', 
      message: error.message 
    });
  }
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});