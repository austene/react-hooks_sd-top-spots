import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  //STATES
  const [hotspots, setHotspots] = React.useState({ hits: [], errorMessage: '' });
  const [isSortedAZ, setIsSortedAZ] = React.useState(true);

  //FUNCTIONS
  //*api call to load hotspots
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

  //*open map loccation tab
  const onClickMap = (location) => {
    const mapUrl = `https://maps.google.com/?q=${location[0]},${location[1]}`
    window.open(mapUrl, '_blank')
  };

  //*determine a-z sort order
  // const sortIcon = () =>
  //   isSortedAZ ? 
  //     <span>A-Z<i className="fas fa-long-arrow-alt-down"></i></span> :
  //     <span>Z-A<i className="fas fa-long-arrow-alt-up"></i></span>
  const sortIcon = 
    isSortedAZ ? 
      <span>(A-Z<i className="fas fa-long-arrow-alt-down"></i>)</span> :
      <span>(Z-A<i className="fas fa-long-arrow-alt-up"></i>)</span>

  //*render table/row/data for hotspots
  const displayHotspots = () =>
    <table>
      <tbody>
        <tr>
          <th>Title{'\u00A0'}{sortIcon}</th>
          <th>Description</th>
          <th>Map</th>
          <th>Favorite</th>
        </tr>
        {hotspots.hits.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>
              <button
                className='btn'
                id='mapBtn'
                onClick={() => onClickMap(item.location)}
                >
                Map
              </button>
            </td>
            <td>
              <button
                className='btn'
                id='favoriteBtn'
                // onClick={() => onClickMap(item.location)}
                >
                Favorite
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

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
