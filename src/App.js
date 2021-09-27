import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  //states
  const [hotspots, setHotspots] = React.useState({ hits: [], errorMessage: '' });

  //functions
  useEffect(() => {
    async function fetchData() {
      // Await response
      try {
        const response = await axios('https://origin-top-spots-api.herokuapp.com/api/topspots');
        //set data to state
        setHotspots({hits: response.data, errorMessage: ''})
      }
      //error
      catch(error) {
        setHotspots({hits: [], errorMessage: error.message})
      }
    }
    fetchData();
  }, []);

  const onClickMap = (location) => {
    const mapUrl = `https://maps.google.com/?q=${location[0]},${location[1]}`
    window.open(mapUrl, '_blank')
  };

  const displayHotspots = () =>
    <ul>
    {hotspots.hits.map(item => (
      <li key={item.id}>
        {item.name}
        <button
          className='btn'
          id='mapBtn'
          onClick={() => onClickMap(item.location)}
        >
          Map
        </button>
      </li>
    ))}
    </ul>

  return (
    <div className="App">
      <h3>San Diego Top Spots</h3>
      <p>Got nothing to do this weekend?</p>
      <p>Now you do!</p>
      <hr />

    {/* Display hotspots hits (success) */}
    { !hotspots.errorMessage && displayHotspots() }

    {/* Display error message (failure) */}
    { hotspots.errorMessage && 
    <h3 className='error'>{ hotspots.errorMessage }</h3>
    && 
    <p>...whoops</p>
    }

      
    </div>
  );
}

export default App;
