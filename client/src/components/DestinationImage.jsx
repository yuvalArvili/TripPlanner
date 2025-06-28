import React, { useEffect, useState } from 'react';

function DestinationImage({ destination }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;

    const fetchImage = async () => {
      try {
        const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${destination}&client_id=${accessKey}&orientation=landscape&per_page=1`
        );
        const data = await response.json();
        const url = data.results[0]?.urls?.regular;
        setImageUrl(url || '');
      } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
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
        !loading && <p>No image found for "{destination}".</p>
      )}
    </div>
  );
}

export default DestinationImage;
