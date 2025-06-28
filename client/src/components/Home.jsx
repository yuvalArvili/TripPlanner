import '../styles/home.css';

//styling for the home component
const Home = () => {
  return (
    <div className="home-wrapper">
      <main className="home-hero">
        <img src="/images/globe.png" alt="Globe" className="globe-large" />
        <img src="/images/rider.png" alt="Cycling" className="rider-image" />
        <div className="hero-text">
          <h1>Welcome to Trip Planner</h1>
          <p>Plan your next adventure<br />with ease</p>

        </div>
      </main>
    </div>
  );
};

export default Home;