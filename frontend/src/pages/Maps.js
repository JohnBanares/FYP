import "../css/Maps.css";
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import foodImg from '../images/food.png';
import { IoNavigate } from "react-icons/io5";


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


const Maps = ({showReviewContainer,showReviewContainerType, showUserReviews, isLoaded}) => {

  const [restaurants, setRestaurants] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const fromRef = useRef();
  const toRef = useRef();
  const [directionsResponse, setDirectionsResponse] = useState(null)


  const [places, setPlaces] = useState([]);
  const [placesMarkers, setPlacesMarkers] = useState([]);

  const [directionsContainer, setDirectionsContainer] = useState(false);
  const [searchContainer, setSearchContainer] = useState(false);
  const typeRef = useRef();
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);
  const [selectedPositionType, setselectedPositionType] = useState(null);

  const handleMarkerClickType = (place, position) => {
    setSelectedPlaceType(place);
    setselectedPositionType(position);
  };



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

  const generateDefaultMarkers = () => {
    setMarkers(generateMarker(randomCoordinates));
  };

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

  const handleShowReviewContainerType = () => {
    showReviewContainerType(selectedPlaceType);
  };

  const handleShowUserReviews = () => {
    showUserReviews(selectedPlace);
  };

  const handleToggle = () => {
    setMarkers(null);
  }

  const calculateRoute = async() => {
    if (fromRef.current.value === '' || toRef.current.value === '') {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: fromRef.current.value,
      destination: toRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
  }

  const resetRoute = () => {
    setDirectionsResponse(null);
    fromRef.current.value = '';
    toRef.current.value = '';
  }
  
  const fetchNearbyPlaces = () => {
    // eslint-disable-next-line no-undef
    const pyrmont = new google.maps.LatLng(53.349805, -6.26031); 

    const request = {
      location: pyrmont,
      radius: '1000',
      type: ['restaurant'],
      keyword:  typeRef.current.value, 
    };

    // eslint-disable-next-line no-undef
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  };

  const callback = (results, status) => {
    // eslint-disable-next-line no-undef
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log('Results:', results);
      const latitude = results[0].geometry.location.lat();
      const longitude = results[0].geometry.location.lng();
      
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      //map specifc places markers
      const newMarkers = results.map((place, index) => {
        const { lat, lng } = place.geometry.location;
        console.log("Place Name:", place.name);
        return (
          <Marker
            key={index}
            position={{ lat: lat(), lng: lng() }}
            onClick={() => handleMarkerClickType(place, { lat: lat(), lng: lng() })}

          />
        );
      });
      setPlacesMarkers(newMarkers);
    } else {
      console.error('Places API request failed with status:', status);
    }
  };

  const showDirectionsContainer = () => {
    setDirectionsContainer(true);
    setSearchContainer(false);
  }

  const showSearchContainer = () => {
    setDirectionsContainer(false);
    setSearchContainer(true);
  }

  const resetSearxh = () => {
    setPlacesMarkers(null);
    typeRef.current.value = '';
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
    {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          onLoad={map => setMap(map)}
        >

          {markers}
          {placesMarkers}

          {selectedPlaceType && (
            <InfoWindow
              position={selectedPositionType}
              onCloseClick={() => setSelectedPlaceType(null)}
            >
              <div className='infoWindow'>
                <h2>{selectedPlaceType.name}</h2>
                <img src={foodImg} alt="temp image" height="60vh" width="100%" />
                <h3>Cuisine Type: {typeRef.current.value}</h3> 
                <button onClick={handleShowReviewContainerType}>Write Review</button>
              </div>
            </InfoWindow>
          )}
          

          {/* For recommendation */}
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

        <Marker 
          position={center}
          style = {{zIndex: "100"}} />

        {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        
        {/* top buttons */}
        <div classname='top-buttons'>
          <button  onClick={() => showSearchContainer()} style={{cursor: "pointer", height: "2rem",width: "4.1vw", padding: "2px",backgroundColor: "white" ,  position: "absolute"  , marginLeft: "20rem", marginTop: "2rem"}} >SearchType</button>
          <button  onClick={() => showDirectionsContainer()} style={{cursor: "pointer", height: "2rem",width: "4.1vw", padding: "2px",backgroundColor: "white" ,  position: "absolute"  , marginLeft: "45rem", marginTop: "2rem"}} >Look Up Direction</button>
        </div>

          {/* search buttons */}
        {searchContainer && (<div className='search'>
          <input type="test" 
              placeholder="Enter Restaurant Type" 
              style={{backgroundColor: "white" ,  position: "absolute", marginLeft: "25rem"}}
              ref={typeRef}
            /> 
          <button onClick={() => fetchNearbyPlaces()} style={{cursor: "pointer", height: "1.7rem",width: "4.1vw", padding: "2px",backgroundColor: "#FFB4B4" ,  position: "absolute"  , marginLeft: "42rem", marginTop: ".2rem"}} >search</button>
          <button onClick={() =>resetSearxh()} style={{cursor: "pointer", height: "1.70rem",width: "4.1vw", padding: "2px",backgroundColor: "#D3D3D3" ,  position: "absolute"  , marginLeft: "42rem", marginTop: "2.3rem"}} >Reset</button>
        </div>)}

          {/* direction buttons */}
       { directionsContainer && (<div className='directions'>
          <Autocomplete>
            <input type="test" 
                    placeholder="From:" 
                    style={{backgroundColor: "white" ,  position: "absolute", marginLeft: "20rem"}}
                    ref={fromRef}
            />  
          </Autocomplete>

          <Autocomplete>
            <input type="test" 
                    palceholder = "Top:" 
                    style={{backgroundColor: "white" ,  position: "absolute"  , marginLeft: "35rem"}}
                    ref={toRef}
            />  
          </Autocomplete>

          <button onClick={() => calculateRoute()} style={{ cursor: "pointer", height: "1.75rem", backgroundColor: "#94BFA2" ,padding: "5px",  position: "absolute"  , marginLeft: "50rem", marginTop: ".5em", marginBottom: "1rem"}} >Get Directions</button>
          <button onClick={() => resetRoute()} style={{cursor: "pointer", height: "1.75rem",width: "4.1vw", padding: "2px",backgroundColor: "#FFB4B4" ,  position: "absolute"  , marginLeft: "50rem", marginTop: "2.5rem"}} >Reset</button>

          <IoNavigate 
            className="location"
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />

          <div className="recommendation">
            <button onClick={() => generateDefaultMarkers()}>Generate recommendation</button> 
            <button onClick={() => handleToggle()}>Clear</button>
        
          </div>
        </div>)}

        {/* <div className="recommendation">
          <button onClick={() => generateDefaultMarkers()}>Generate recommendation</button> 
          <button onClick={() => handleToggle()}>Clear</button>
       
        </div> */}
        </GoogleMap>
      )}
      
    </div>
  );
};

export default Maps;

