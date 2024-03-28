
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import foodImg from '../images/food.png';

const mapContainerStyle = {
  marginTop: '5rem',
  width: '50vw',
  height: '80vh',
  marginLeft: '5rem',
};

const center = {
  lat: 53.38913104764263,  // default latitude
  lng: -6.39152654460699, // default longitude
};


const fakePlace1 = {
  name: "Fake Place 1",
  description: "This is a fake place 1.",
};

// const fakePlace2 = {
//   name: "Fake Place 2",
//   description: "This is a fake place 2.",
// };
// const fakePlace3 = {
//   name: "Fake Place 3",
//   description: "This is a fake place 3.",
// };


const Maps = ({showReviewContainer, showUserReviews, close}) => {

  const [restaurants, setRestaurants] = useState([]);


  useEffect(() => {
    fetch('/api/restaurant')
      .then(response => response.json())  
      .then(data => {
        setRestaurants(data);
        
      })
      .catch(error => {
        console.error('Error fetching restaurant data:', error);
      });
  }, []);

  console.log("restaurant", restaurants);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:  process.env.REACT_APP_API_KEY,

  });

  const randomCoordinates = [
    { lat: 53.38913104764263, lng: -6.37152654460699 }, 
    { lat: 53.377279717592806, lng: -6.266941138019687 },
    { lat: 53.324165951247785, lng: -6.361614151592908 },
    { lat: 53.401234, lng: -6.364353 },
    { lat: 53.391112, lng: -6.379876 },
    { lat: 53.365372, lng: -6.346876 },
    { lat: 53.374845, lng: -6.397254 },
    { lat: 53.378912, lng: -6.320915 },
    { lat: 53.366743, lng: -6.356842 },
    { lat: 53.354978, lng: -6.388773 },
    { lat: 53.381277, lng: -6.377886 },
    { lat: 53.396876, lng: -6.342678 },
    { lat: 53.386742, lng: -6.301476 },
    { lat: 53.372413, lng: -6.331285 },
  ];

  const generateMarker = (randomCoordinates) => {
    return randomCoordinates.map((cords, index) => (
      <Marker key={index} position={cords} onClick={() => handleMarkerClick(restaurants[index], cords)}/>
    ));
  }

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPosition, setselectedPosition] = useState(null);


  const handleMarkerClick = (place, position) => {
    setSelectedPlace(place);
    setselectedPosition(position);
  };

  const handleInfoWindowClose = () => {
    setSelectedPlace(null);
    close(false);
  };

  const handleShowReviewContainer = () => {
    showReviewContainer(selectedPlace);
  };

  const handleShowUserReviews = () => {
    showUserReviews(selectedPlace);
  };


  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        {/* <Marker position={center} onClick={() => handleMarkerClick(fakePlace1,center)} /> */}
        {/* <Marker position={p2} onClick={() => handleMarkerClick(fakePlace2, p2)} />
        <Marker position={p3} onClick={() => handleMarkerClick(fakePlace3, p3)} /> */}

        {generateMarker(randomCoordinates)}

        {selectedPlace && (
          <InfoWindow
            position={selectedPosition}
            onCloseClick={handleInfoWindowClose}
          >
            <div className='infoWindow'>
              <h2>{selectedPlace.restaurantName}</h2>
              <img src={foodImg} alt="temp image" height="60vh" width="100%" />
              <h3>Cuisine Type: {selectedPlace.restaurantType}</h3> 
              <button onClick={handleShowReviewContainer}>Write Review</button>
              <button onClick={() => handleShowUserReviews()} style={{marginLeft: "10px"}}>View Reviews</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Maps;

// import React, { useState, useEffect } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';

// const Maps = () => {
//     const [map, setMap] = useState(null);

//     useEffect(() => {
//         const loader = new Loader({
//             apiKey: `${process.env.REACT_APP_API_KEY}`,
//             version: 'weekly',
//         });

//         loader.load().then(() => {
//             const google = window.google;
//             const mapInstance = new google.maps.Map(document.getElementById('map'), {
//                 center: { lat: -34.397, lng: 150.644 }, // Set initial center coordinates
//                 zoom: 8, // Set initial zoom level
//             });
//             setMap(mapInstance);
//         });
//     }, []);

//     return (
//         <div>
//             <h1>Map Component</h1>
//             <div id="map" style={{ width: '100%', height: '400px' }}></div>
//         </div>
//     );
// };


// export default Maps;

// WARNING in ./node_modules/@googlemaps/js-api-loader/dist/index.mjs
// Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
// Failed to parse source map from 'C:\FYP\frontend\node_modules\@googlemaps\src\index.ts' file: Error: ENOENT: no such file or directory, open 'C:\FYP\frontend\node_modules\@googlemaps\src\index.ts'

// WARNING in [eslint]
// src\pages\Maps.js
//   Line 134:12:  'map' is assigned a value but never used  no-unused-vars