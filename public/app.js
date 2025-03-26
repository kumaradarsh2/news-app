document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('newsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Fetch and display news
    async function fetchNews(query = '') {
        // Clear previous content
        newsContainer.innerHTML = '<div class="loading">Loading news...</div>';

        try {
            // Fetch news from our backend API
            const response = await fetch(`/api/news${query ? `?q=${query}` : ''}`);
            
            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                // Try to get more error details
                const errorBody = await response.text();
                console.error('Error response:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const articles = await response.json();
            console.log('Received articles:', articles); // Debug log

            // Clear loading and display news
            newsContainer.innerHTML = '';

            // If no articles found
            if (!articles || articles.length === 0) {
                newsContainer.innerHTML = '<div class="error">No news articles found.</div>';
                return;
            }

            // Create news cards
            articles.forEach(article => {
                // Skip articles without image or title
                if (!article.urlToImage || !article.title) return;

                const newsCard = document.createElement('div');
                newsCard.classList.add('news-card');

                newsCard.innerHTML = `
                    <img src="${article.urlToImage}" alt="${article.title}">
                    <div class="news-card-content">
                        <h2>${article.title}</h2>
                        <p>${article.description || 'No description available'}</p>
                        <a href="${article.url}" target="_blank">Read More</a>
                    </div>
                `;

                newsContainer.appendChild(newsCard);
            });
        } catch (error) {
            console.error('Detailed Fetch Error:', error);
            newsContainer.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    // Initial news load
    fetchNews();

    // Search functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchNews(query);
    });

    // Allow search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            fetchNews(query);
        }
    });
});