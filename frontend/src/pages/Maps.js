import "../css/Maps.css";
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import foodImg from '../images/food.png';
import { IoNavigate } from "react-icons/io5";
import { useFilters } from './FiltersContext'; // Adjust path as needed



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


const Maps = ({showReviewContainer,showReviewContainerType, showUserReviews, isLoaded, showAPIReviews, showAdvancedContainer}) => {

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

  const [apiReviews, setAPIReviews] = useState([]);
  

  const { filters } = useFilters();
  const { request, price, count } = filters;

  let [placeUrl, setPlaceUrl] = useState('');


  const handleMarkerClickType = (place, position) => {
    setSelectedPlaceType(place);
    setselectedPositionType(position);
    
    let temp= place.place_id
    //get url
    // console.log("place is", temp);
    getUrl(temp);
  };

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


  //pass db restaurant data for writing reviews
  const handleShowReviewContainer = () => {
    showReviewContainer(selectedPlace);
  };

  //pass api restaurnt name for writing reviews
  const handleShowReviewContainerType = () => {
    showReviewContainerType(selectedPlaceType);
  };

  const handleShowAdvancedContainer = () => {
    showAdvancedContainer();
  }

  //pass prop to parent component
  const handleShowUserReviews = () => {
    showUserReviews(selectedPlace);
  };

  const handleToggle = () => {
    setMarkers(null);

  }
    //---------------------------------------Get Url ------------------------------------------------------

    const getUrl = (place_id) => {
      // console.log(place_id);
      var request = {
        placeId: place_id,
        fields: ['url']
      };
      
      // eslint-disable-next-line no-undef
      const service = new google.maps.places.PlacesService(map);
      service.getDetails(request, callback4);
    
    }
  
    const callback4 = (place, status) => {
          // eslint-disable-next-line no-undef
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // console.log("get url", place.url);
        setPlaceUrl(place.url);
      } else {
        console.error('Failed to fetch reviews for place:', status);
      }
    }

    //---------------------------------------Advance search ------------------------------------------------------

    useEffect(() => {
      // Log the filters whenever they change
      // console.log('Filters updated:', { request, price, count });
  
      if (isLoaded && map) {
        showAdavanceMarker();
      }
  
    }, [request, price, count]);

    const showAdavanceMarker = () => {
               
      // eslint-disable-next-line no-undef
      const service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback3) 
    }

    const callback3 = (results, status) => {
      // eslint-disable-next-line no-undef
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Results:", results);

        //map specifc places markers
        const filteredResults = results
        .filter(place => place.price_level === price) 
        .filter(place => place.rating > count); 

        console.log("Filtered Results:", filteredResults);

      // Map specific places markers
        const newMarkers = filteredResults.map((place, index) => {
          const { lat, lng } = place.geometry.location;
    
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

  //---------------------------------------Calculate route ------------------------------------------------------
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

  //---------------------------------------Find nearby places ------------------------------------------------------
  const fetchNearbyPlaces = () => {
    // dublin spire cords used for demoing restaurants nearby
    // eslint-disable-next-line no-undef
    const cord = new google.maps.LatLng(53.349805, -6.26031); 

    const request = {
      location: cord,
      radius: '2000',
      type: ['restaurant'],
      query:  typeRef.current.value, 
    };

    // eslint-disable-next-line no-undef
    const service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    // service.textSearch(request, (results, status) => {
    
    //   const filteredResults = results.filter(place => place.takeout === true);
    //   callback(filteredResults, status);
    // });

  };

  const callback = (results, status) => {
    // eslint-disable-next-line no-undef
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log('Results:', results);
      // const latitude = results[0].geometry.location.lat();
      // const longitude = results[0].geometry.location.lng();
      
      // console.log('Latitude:', latitude);
      // console.log('Longitude:', longitude);

      //map specifc places markers
      const newMarkers = results.map((place, index) => {
        const { lat, lng } = place.geometry.location;

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

  
  const findSpecificRoute = async(dest) =>{
    //eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: center,
      destination: dest,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    // console.log("orignn",center);
    // console.log("dest",dest);

  }
  //--------------------------------------------View API Reviews--------------------------------------------------------------------
  
  const getShowAPIReviews = (place_id) => {
    // console.log(place_id);
    var request = {
      placeId: place_id,
      fields: ['reviews', 'url']
    };
  
    // eslint-disable-next-line no-undef
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback2);
  
  }

  const callback2 = (place, status) => {
        // eslint-disable-next-line no-undef
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log('get details',place);
      console.log('Reviews:', place.reviews);
      // const photos = place.photos[0].getUrl();
      // console.log('Photo:', photos);
      showAPIReviews(place.reviews);
    } else {
      console.error('Failed to fetch reviews for place:', status);
    }
  }
  

  const showDirectionsContainer = () => {
    setDirectionsContainer(true);
    setSearchContainer(false);
  }

  const showSearchContainer = () => {
    setDirectionsContainer(false);
    setSearchContainer(true);
  }

  //close search
  const resetSearxh = () => {
    setPlacesMarkers(null);
    setDirectionsResponse(null);
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

          {/* Info window for API plaeces */}
          {selectedPlaceType && (
            <InfoWindow
              position={selectedPositionType}
              onCloseClick={() => setSelectedPlaceType(null)}
            >
              <div style={{ maxWidth: "300px"}} className='infoWindow'>
                <h2>{selectedPlaceType.name}</h2>
                <img src={selectedPlaceType.photos[0].getUrl()} alt="temp image" height="auto" width="100%" />
                <h3>Cuisine Type: {typeRef.current.value}</h3> 
                <h3>Rating: {selectedPlaceType.rating}</h3> 
                <button onClick={handleShowReviewContainerType}>Write Review</button>
                <button onClick={() => getShowAPIReviews(selectedPlaceType.place_id)} style={{marginLeft: "10px"}}>View Reviews</button>
                <button onClick={()=>findSpecificRoute(selectedPositionType)} style={{marginLeft: "10px"}}>Get Directions</button>
                <a href={placeUrl} style={{textDecoration : "none", marginTop: "10px"}}>
                  Visit Website
                </a>
              </div>
            </InfoWindow>
          )}
          

          {/* For recommendation hardcoded */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPosition}
              onCloseClick={handleInfoWindowClose}
              className='temp'
            >
              <div className='infoWindow'>
                <h2>{selectedPlace.restaurantName}</h2>
                <img src={foodImg} alt="temp image" height="auto" width="100%" />
                <h3>Cuisine Type: {selectedPlace.restaurantType}</h3> 
                <button onClick={handleShowReviewContainer}>Write Review</button>
                <button onClick={() => handleShowUserReviews()} style={{marginLeft: "10px"}}>View Reviews</button>
                <button onClick={() => findSpecificRoute(selectedPosition)} style={{marginLeft: "10px"}}>Get Directions</button>

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
          <button  onClick={() => showSearchContainer()} style={{cursor: "pointer", height: "2rem",width: "4.1vw", padding: "2px",backgroundColor: "#4d97af" ,  position: "absolute"  , marginLeft: "20rem", marginTop: "2rem"}} >SearchType</button>
          <button  onClick={() => showDirectionsContainer()} style={{cursor: "pointer", height: "2rem",width: "4.1vw", padding: "2px",backgroundColor: "#4d97af" ,  position: "absolute"  , marginLeft: "45rem", marginTop: "2rem"}} >Look Up Direction</button>
        </div>

          {/* search buttons */}
        {searchContainer && (<div className='search'>
          <input type="test" 
              placeholder="Enter Restaurant Type" 
              style={{backgroundColor: "white" ,  position: "absolute", marginLeft: "25rem"}}
              ref={typeRef}
            />
          <button onClick={() => fetchNearbyPlaces()} style={{cursor: "pointer", height: "1.7rem",width: "4.1vw", padding: "2px",backgroundColor: "#6fd96e" ,  position: "absolute"  , marginLeft: "42rem", marginTop: ".2rem"}} >Search</button>
          <button onClick={() =>resetSearxh()} style={{cursor: "pointer", height: "1.70rem",width: "4.1vw", padding: "2px",backgroundColor: "#FFB4B4" ,  position: "absolute"  , marginLeft: "42rem", marginTop: "2.3rem"}} >Reset</button>
          <button onClick={handleShowAdvancedContainer} style={{cursor: "pointer", height: "1.8rem",width: "5vw", padding: "2px",backgroundColor: "#D3D3D3" ,  position: "absolute"  , marginLeft: "42rem", marginTop: "4.3rem"}} >Advanced Filters</button>

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

          {/* <div className="recommendation">
            <button onClick={() => generateDefaultMarkers()}>Generate recommendation</button> 
            <button onClick={() => handleToggle()}>Clear</button>
        
          </div> */}
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

