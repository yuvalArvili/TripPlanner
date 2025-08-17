import React, { useEffect, useState } from 'react';

// This component fetches and displays an image from Unsplash based on the provided destination
// It normalizes the destination input to match common city names and handles loading states
function DestinationImage({ destination }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const fallbackImage = '/images/default.png';

  // Normalize destination input to match common city names
  const normalizeDestination = (input) => { 
    const mapping = {
      tlv: 'Tel Aviv',
      nyc: 'New York City',
      lon: 'London',
      sf: 'San Francisco',
      bcn: 'Barcelona',
      la: 'Los Angeles',
    };
    const key = input.trim().toLowerCase(); 
    return mapping[key] || input;
  };

  useEffect(() => {
    if (!destination) return;

    setImageUrl(''); //  reset on every new destination
    setLoading(true);

    // Fetch image from Unsplash API based on the normalized destination
    const fetchImage = async () => {
      try {
        const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
        const normalized = normalizeDestination(destination);
        const query = encodeURIComponent(`${normalized} city`); 
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&orientation=landscape&per_page=1`
        );
        const data = await response.json();
        const url = data.results[0]?.urls?.regular;
        setImageUrl(url || fallbackImage); // use fallback image if no result found
      } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
        setImageUrl(fallbackImage);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [destination]);

  if (!destination) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      {loading && <p>Loading image...</p>}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={destination}
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '12px',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
          }}
        />
      ) : (
        !loading && (
          <p>No image found for "{destination}".</p>
        )
      )}
    </div>
  );
}

export default DestinationImage;