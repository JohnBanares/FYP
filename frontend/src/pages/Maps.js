import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import foodImg from '../images/food.png';

const mapContainerStyle = {
  marginTop: '5rem',
  width: '50vw',
  height: '80vh',
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


const Maps = ({showReviewContainer}) => {

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
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
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
  };

  const handleShowReviewContainer = () => {
    showReviewContainer(selectedPlace);
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
              <p>{selectedPlace.restaurantType}</p> 
              <button onClick={handleShowReviewContainer}>Write Review</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Maps;