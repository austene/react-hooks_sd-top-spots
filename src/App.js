import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  //states
  const [hotspots, setHotspots] = React.useState({ hits: [], errorMessage: '' });

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

  return (
    <div className="App">
      <header>San Diego Top Spots</header>
      <p>info here</p>
      <hr />

    {/* Display hotspots hits (success) */}
    { !hotspots.errorMessage &&
    <ul>
      {hotspots.hits.map(item => (
        <li key={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
    }

    {/* Display error message (failure) */}
    { hotspots.errorMessage && 
    <h3 className='error'>{ hotspots.errorMessage }</h3>
    }
    <p>...whoops</p>

      
    </div>
  );
}

export default App;
