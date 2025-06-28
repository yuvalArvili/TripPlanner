const groqApiKey = process.env.REACT_APP_GROQ_API_KEY;
const orsApiKey = process.env.REACT_APP_ORS_API_KEY;

export async function getStartPointFromAI(city, tripType) {
  const prompt = `Give one GPS coordinate (lat/lng) to use as a starting point for a ${tripType.toLowerCase()} circular route inside the city of ${city}.
The full round-trip route starting and ending at this point should be between 5 to 15 kilometers in total.
Make sure the point is located on a real walkable road or cycling path supported by OpenRouteService.
Return only JSON like:
{
  "start": { "lat": ..., "lng": ... }
}
No explanation.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You help plan realistic travel routes using real places.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await res.json();
  const content = data.choices[0].message.content;

  let jsonStart = content.indexOf('{');
  let jsonEnd = content.lastIndexOf('}');
  let jsonText = content.slice(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(jsonText);
  return [parsed.start.lng, parsed.start.lat];
}

async function fetchRoundTripRoute(start) {
  const res = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
    method: 'POST',
    headers: {
      'Authorization': orsApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates: [start],
      options: {
        round_trip: {
          length: 8000,
          points: 5,
          seed: 1
        }
      }
    })
  });

  const data = await res.json();
  if (!data.features || data.features.length === 0) {
    throw new Error('No route found.');
  }

  return data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
}

export async function fetchHikingRouteWithRetry(city) {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Getting start point for hiking route...`);
      const start = await getStartPointFromAI(city, 'Hiking');
      console.log(`Start point received. Fetching round-trip route...`);
      const route = await fetchRoundTripRoute(start);

      return {
        route,
        startPoint: [start[1], start[0]]
      };
    } catch (error) {
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxAttempts) {
        throw new Error('Failed to generate hiking route after 5 attempts.');
      }
    }
  }
}