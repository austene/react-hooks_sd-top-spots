import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  //STATES
  const [hotspots, setHotspots] = React.useState({ hits: [], errorMessage: '' });
  const [isSortedAZ, setIsSortedAZ] = React.useState(true);
  const [favorites, setFavorites] = React.useState([]);
  const [favoriteSelected, setFavoriteSelected] = React.useState({});

  //FUNCTIONS
  //*sort function
  const sortTitles = (hotspotsToSort, orderFlag) => {
    hotspotsToSort.sort((a,b) => {
      let titleA = a.name.toUpperCase();
      let titleB = b.name.toUpperCase();
      if (orderFlag) {
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      } else {
        return (titleA > titleB) ? -1 : (titleA < titleB) ? 1 : 0;
      };
    });
  };

  //*api call to load hotspots
  useEffect(() => {
    async function fetchData() {
      // Await response
      try {
        const response = await axios('https://origin-top-spots-api.herokuapp.com/api/topspots');
        //catch data
        let hotspots = response.data;
        //sort data
        sortTitles(hotspots, isSortedAZ)
        //set data to state
        setHotspots({hits: hotspots, errorMessage: ''})
        
      }
      //error
      catch(error) {
        setHotspots({hits: [], errorMessage: error.message})
      }
    }
    fetchData();
  }, [isSortedAZ]);

  //*open map location tab
  const onClickMap = (location) => {
    const mapUrl = `https://maps.google.com/?q=${location[0]},${location[1]}`
    window.open(mapUrl, '_blank')
  };

  //*add hotspot to favorite array
  const onClickAddFavorite = (hotspot) => {
    let filteredFavorites = [];
    filteredFavorites = favorites.filter(favorite => {
      return favorite.id === hotspot.id;
    });
    if (filteredFavorites.length === 0) {
      setFavorites(favorites.concat(hotspot));
    };
  };

  //*delete hotspot from favorite array
  const onClickDelete = (id) => {
    let filteredFavorites = favorites.filter(favorite => {
      return favorite.id !== id;
    });
    setFavorites(filteredFavorites);

    if (favoriteSelected.id === id) {
      setFavoriteSelected({});
    };
  };

  //*set state to display selected favorite
  const onClickSelectFavorite = (favorite) => {
    setFavoriteSelected(favorite);
  };

  //*exit displayed selected favorite
  const onClickExitIcon = () => {
    setFavoriteSelected({});
  };

  //DISPLAYS
  //*determine a-z sort order render
  const sortIcon = 
    isSortedAZ ? 
      <span>(A-Z<i className="fas fa-long-arrow-alt-down"></i>)</span> :
      <span>(Z-A<i className="fas fa-long-arrow-alt-up"></i>)</span>

  //*render display box for favoriteSelected information
  const displayFavoriteSelected = () =>
    <div id='display-box'>
      <p>{favoriteSelected.description}</p>
      <span>
        <i
          className='far fa-times-circle pointer top-right'
          id='exitIcon'
          onClick={() => onClickExitIcon()}
        />
      </span>
      <button
        className='btn'
        id='mapBtn'
        onClick={() => onClickMap(favoriteSelected.location)}
        >
        Map
      </button>
    </div>;

  //*render display for hotspots (table/row/data)
  const displayHotspots = () =>
    <table>
      <tbody>
        <tr>
          <th
            id="sortTitleBtn"
            className='pointer'
            onClick={() => setIsSortedAZ(!isSortedAZ)}
          > 
            Title{'\u00A0'}{sortIcon}</th>
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
                onClick={() => onClickAddFavorite(item)}
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

      {/* Favorites Array */}
      <h4>Favorites</h4>
      { favorites.map(favorite =>
        <div key={favorite.id}>
          <span
            className='pointer'
            onClick={() => onClickSelectFavorite(favorite)}
          >
            {favorite.name}
          </span>
          <span>
            {'\u00A0'}
            <i
              className='far fa-trash-alt pointer'
              id='deleteFavoriteIcon'
              onClick={() => onClickDelete(favorite.id)}
            />
          </span>
          {/* Display favoriteSelected Box */}
          <div>{favorite.id === favoriteSelected.id && displayFavoriteSelected()}</div>
        </div>
      )}

      <hr />

    {/* Display hotspots hits (success) */}
    { !hotspots.errorMessage && displayHotspots() }

    {/* Display error message (failure) */}
    { 
      hotspots.errorMessage && 
      <h3 className='error'>{ hotspots.errorMessage }</h3> && 
      <p>...whoops</p>
    }
      
    </div>
  );
}

export default App;
