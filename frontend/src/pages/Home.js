import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as d3 from 'd3'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaStar } from "react-icons/fa"
import { IoMdArrowRoundForward } from "react-icons/io";
import "../css/Home.css"
import foodImg from '../images/food.png';
import { useJsApiLoader } from '@react-google-maps/api';
import { GiPathDistance } from "react-icons/gi";
import { AiTwotoneStar } from "react-icons/ai";
import { MdOutlineFoodBank } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { useFilters } from './FiltersContext';





// import dataTSV from '../images/Restaurant_Reviews.tsv'
import NavBar from "./NavBar"
import Maps from "./Maps"


const googleMapsApiKey = process.env.REACT_APP_API_KEY;
const libraries = ['places'];
function Home( apiKey) {

	const [reviews, setReviews] = useState('');
	// const [tsvData, setTsvData] = useState([]);
	const [authenticated, setAuthenticated] = useState('');
	const [selectedPlaceHome, setSelectedPlaceHome] = useState(null);
	const [rating, setRating] = useState(null);
	const [hover, setHover] = useState(null);
	const [reviewText, setReviewText] = useState('');

	const email = localStorage.getItem('email');
	const username = localStorage.getItem('username');
	const navigate = useNavigate();


	const [reviewContainer, setReviewContainer] = useState(false);
	const [showReview, setShowReview] = useState(false);
	const [userReviews, setUserReviews] = useState([]);

	
	const [selectedPlaceHomeType, setSelectedPlaceHomeType] = useState(null);

	//store restuarnat reviews from maps 
	const [apiReviews, setAPIReviews] = useState([]);

	const[reviewImage, setReviewImage] = useState('yes');

	const [advancedContainer, setAdvancedContainer] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState(null);
	let [count, setCount] = useState(1);
	let [countRaidus, setRadiusCount] = useState(1);
	const [area, setArea] = useState('');
	const [cuisine, setCuisine] = useState('')
	const { updateFilters } = useFilters();






	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey,
		libraries,
	});
	
	useEffect(() => {
		const loggedInUser = localStorage.getItem('authenticated');
		// console.log(loggedInUser);
		if (loggedInUser === 'true') {
		  setAuthenticated(true);
		} else {
		  setAuthenticated(false);
		  navigate('../'); 
		}
	  }, [navigate]);
	//------------------------------------------------------------------------------------------------------------------------------------------------------
	// useEffect(() => {
	// 	  d3.tsv("/Restaurant_Reviews.tsv").then(data => {
	// 	    console.log(data); 
	// 	    const reviewText = data.slice(0, 800).map(reviews => reviews.Review);
	// 	    const testingText  = data.slice(800,1000).map(reviews => reviews.Review);
	// 	    // console.log(testingText);
	// 	    const corpus = reviewText.join(' ');
  
	// 	    const wordIndex = {};
	// 	    let index = 1; //keep count of words
	// 	    corpus.split(' ').forEach(word => {
	// 	        if (!wordIndex[word]) {
	// 	            wordIndex[word] = index;
	// 	            index++;
	// 	        }
	// 	    });
	// 	    console.log(wordIndex);

	// 		let training_padded = reviewText.map(review => {
	// 	      return review.split(' ').map(word => wordIndex[word] || 0);
	// 	    });
	// 	    let testing_padded = testingText.map(review => {
	// 	      return review.split(' ').map(word => wordIndex[word] || 0);
	// 	    });
			
	// 	    //pad
	// 	    const maxLength = Math.max(...training_padded.map(seq => seq.length));
	// 	      training_padded = training_padded.map(seq => {
	// 	      const padLength = maxLength - seq.length;
	// 	      return seq.concat(Array(padLength).fill(0));
	// 	    });
	// 	      testing_padded = testing_padded.map(seq => {
	// 	      const padLength = maxLength - seq.length;
	// 	      return seq.concat(Array(padLength).fill(0));
	// 	    });

	// 	    console.log(training_padded);
	// 	    console.log(testing_padded);
	// 	  });
	// }, []);
  
	//-------------------------------------------------------------------------------------------------------------------------------------------------------   
//   useEffect(() => {
//     // Fetch restaurant data from MongoDB
//     fetch('/api/reviews')
//       .then(response => response.json())
//       .then(data => {
//         const reviewsArray = Object.values(data).flat();
//         setReviews(reviewsArray);

//       })
//       .catch(error => {
//         console.error('Error fetching restaurant data:', error);
//       });
//   }, []);
  // console.log('reviews', reviews);


  useEffect(() => {
    const loggedInUser = localStorage.getItem('authenticated');
    // console.log(loggedInUser);
    if (loggedInUser === 'true') {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('../');
    }
  }, [navigate]);

  	//write review container from db restaurants
	const showReviewContainer = (place) => {
		console.log(place);
		setReviewContainer(true);
		setSelectedPlaceHome(place);
	};
	
	//display advanced search container
	const showAdvancedContainer = () => {
		// console.log("showing advanced");
		setReviewContainer(false);
		setAdvancedContainer(true);
	};

	const closeAdvancedContainer = () => {
		// console.log("showing advanced");
		setAdvancedContainer(false);
	};

	//close writing review container
	const closeReviewContainer = () => {
		setReviewContainer(false);
		setSelectedPlaceHome(null);
		setSelectedPlaceHome(null);
	};


	//wrtie review from api restaurants
	const showReviewContainerType = (place) => {
		setAdvancedContainer(false);
    	setReviewContainer(true);
    	setSelectedPlaceHomeType(place);

	};

	//display user written reviews 
	const showAPIReviews = (reviews) => {
		setShowReview(true);
    	setAPIReviews(reviews);

	};


  const showUserReviews = async (place) => {
    // console.log(place.restaurantName);
    const restaurantName = place.restaurantName;
    axios.get(`http://localhost:3003/api/reviews/get-reviews-restaurantName/${restaurantName}`)
    .then(response => {
        // setReviews(response.data);
        console.log(response.data);

        setUserReviews(response.data);    
        setShowReview(true);
    })
    .catch(error => {
        console.error('Error fetching reviews:', error);
    });
  }

  const showUserReviewsContainer = () => {
    setShowReview(false);
  };


  const handleSubmit = async(event) => {
    event.preventDefault();

    if (rating === null || reviewText.trim() === '') {
      console.log("Please provide a rating and review text");
      return;
    }

	if (reviewImage === 'yes') {
		console.log("Please provide an image");
		return;
	}
    const num_rating = parseFloat(rating);

    //console.log("Hey" + username )

	if(selectedPlaceHome == null){

		setReviewContainer(false);

		const formData = new FormData();
		formData.append("username", username);
		formData.append("restaurantName", selectedPlaceHomeType.name);
		formData.append("rating", num_rating);
		formData.append("description", reviewText);
		formData.append("file", reviewImage);

		try{
			const result = await axios.post(
				`http://localhost:3003/api/reviews/`,
				formData,
				{
				  headers: { "Content-Type": "multipart/form-data" },
				}
			);

			setRating(null);
			setReviewText('');
			setSelectedPlaceHome(null);
			setSelectedPlaceHomeType(null);
			setReviewImage('yes');

			console.log('Review submitted successfully:', result.data);

		}catch(error){
			console.log(error);
		}

	}

	if(selectedPlaceHomeType == null){

		const formData = new FormData();
		formData.append("username", username);
		formData.append("restaurantName", selectedPlaceHomeType.name);
		formData.append("rating", num_rating);
		formData.append("description", reviewText);
		formData.append("file", reviewImage);

		try{
			const result = await axios.post(
				`http://localhost:3003/api/reviews/`,
				formData,
				{
				  headers: { "Content-Type": "multipart/form-data" },
				}
			);

			setRating(null);
			setReviewText('');
			setSelectedPlaceHome(null);
			setSelectedPlaceHomeType(null);
			setReviewImage('yes');


			console.log('Review submitted successfully:', result.data);

		}catch(error){
			console.log(error);
		}
	}
};

	const convertImage = (e) => {

		setReviewImage(e.target.files[0]);
		console.log(reviewImage);

	}

	const handleAreaChange = (e) => setArea(e.target.value);
  	const handleCuisineChange = (e) => setCuisine(e.target.value);

	const handleCheckboxChange = (value) => {
		if (selectedPrice === value) {
			setSelectedPrice(null);
		} else {
			setSelectedPrice(value);
		}
	};

	const incrementCount = () =>{
		if (count < 5) { 
			setCount(count + 1);
		}
	}

	const decrementCount = () =>{
		if (count > 1) { 
			setCount(count - 1);
		  }
	}

	const incrementRadiusCount = () =>{
		if (countRaidus < 10) { 
			setRadiusCount(countRaidus + 1);
		}
	}

	const decrementRadiusCount = () =>{
		if (countRaidus > 1) { 
			setRadiusCount(countRaidus - 1);
		  }
	}

	const applyFilters = () =>{
		let price = Number(selectedPrice);
		let combinedquery = area + " " + cuisine;
		let distance = String(countRaidus * 1000);
		const cord = { lat: 53.349805, lng: -6.26031 };



		const request = {
			location: cord,
			radius: distance,
			type: ['restaurant'],
			query: combinedquery, 
		};

		// console.log("applying filters");
		// console.log(request, price, count);
		updateFilters({ request, price, count });

		// console.log(distance);

		// // console.log(cuisineRef.current.value);
		// console.log(price);
		// console.log(count);
	}

	return (
    	<>
      	<NavBar />
      	<div className='home'>
        	<div className='maps'>
          	<Maps showReviewContainer={showReviewContainer} showReviewContainerType={showReviewContainerType} showUserReviews={showUserReviews} isLoaded={isLoaded} showAPIReviews={showAPIReviews} showAdvancedContainer={showAdvancedContainer}/>
         
          
        	{!reviewContainer && showReview && !advancedContainer && (<div  className="user-reviews-container">
           		<IoMdArrowRoundForward  className='user-reviews-container-back' onClick={() => showUserReviewsContainer()}/>
            	{apiReviews.map((review, index) => (
                	<div key={index} className="user-reviews-container-details">
                    	<img src={foodImg} alt="temp image" height="50%" width="100%" />
                    	<div className="fields">
                        	<h3>Username: {review.author_name}</h3>
                        	<h3>Rating: {review.rating}</h3>
                        	<h3>Review: {review.text}</h3>
                    	</div>
                	</div>
             	 ))}   
			</div>)}
			
			{/* show */}
			{advancedContainer && (<div  className="user-reviews-container">
				<IoMdArrowRoundForward  className='user-reviews-container-back' onClick={() => closeAdvancedContainer()}/>
				<div className='advanced-search-outer'>

					<div className='advanced-search-inner'>

						<div className='advanced-search-cuisine'>
							<h3>Area </h3>
							<VscLocation className='area'/>:
							<input type='text' className='advanced-input' placeholder='e.g Dublin, City'onChange={handleAreaChange}/> 

						</div>

						<div className='advanced-search-cuisine'>
							<h3>Cuisine Type </h3>
							<MdOutlineFoodBank className='cuisine' />:
							<input type='text'  className='advanced-input' placeholder='e.g Italian'onChange={handleCuisineChange}/>

						</div>

						<div className='advanced-search-price'>
							<h3>Price Range €: </h3>
							<input type="checkbox" value="1"  name="priceRange" checked={selectedPrice === '1'} onChange={() => handleCheckboxChange('1')}/>  € 10-20
							<input type="checkbox" value="2"  name="priceRange" checked={selectedPrice === '2'} onChange={() => handleCheckboxChange('2')}/>  € 20-30
							<input type="checkbox" value="3" name="priceRange" checked={selectedPrice === '3'} onChange={() => handleCheckboxChange('3')}/> {' € > 30'}
						</div>

						<div className='advanced-search-rating'>
							<h3>Minimum Rating </h3>
							<AiTwotoneStar className='star-rating'/>:	
							<button style={{width: "25px", height: "25px"}} onClick={() => incrementCount()}>+</button>
							<div>{count} Stars</div>
							<button  style={{width: "25px", height: "25px"}} onClick={() => decrementCount()}>-</button>
						</div>

						<div className='advanced-search-radius'>
							<h3>Search Radius </h3> 
							<GiPathDistance className='within'/>:
							<button style={{width: "25px", height: "25px"}} onClick={incrementRadiusCount}>+</button>
							<div>{countRaidus} KM</div>
							<button  style={{width: "25px", height: "25px"}} onClick={decrementRadiusCount}>-</button>
						</div>

						<div className='advance-button'>
							<button className='apply-filter' onClick={applyFilters}>Apply Filters</button>
						</div>

					</div>
				</div>
        	</div>)}

        	<div className={`rev-form ${reviewContainer ? '' : 'hidden'}`}>


				<div className='review-form-details'>
				<form onSubmit={handleSubmit} className="form">
					<div className='form-top'>
						<div className='form-col'>
							<h2>Restaurant:</h2>
							{selectedPlaceHome && (
							<p style={{ fontSize: '1.3rem', marginTop: "1rem"}}>{selectedPlaceHome.restaurantName}</p>
							)}
							{selectedPlaceHomeType && (
							<p style={{ fontSize: '1.3rem', marginTop: "1rem" }}>{selectedPlaceHomeType.name}</p>
							)}
						</div>
						<div className='form-col'>
							<h2>Rating:</h2>
							<div style={{ display: 'flex', color: " yellow", marginTop: '1rem' }}>
							{[...Array(5)].map((star, index) => {
								const currentRating = index + 1;
								return (
								<label>
									<input
									type="radio"
									name="rating"
									value={currentRating}
									onClick={() => setRating(currentRating)}
									/>
									<FaStar
									className="star"
									size={30}
									color={currentRating <= (hover || rating) ? "orange" : "#D0D0D0"}
									onMouseEnter={() => setHover(currentRating)}
									onMouseLeave={() => setHover(null)}
									/>
								</label>
								);
							})}
							</div>
							{/* <p style={{color: "black"}}>Rating is {rating}</p> */}

						</div>
					</div>
						
					{/* <textarea className="rating-box" ></textarea> */}

					<div className='uploads'>
						<label>
							Upload a photo
						<input
							type="file"
							accept="image/*"
							onChange={convertImage}
							className="change-image-input"
						/>
						</label>
					</div>
					
					<h2>Description:</h2>
					<textarea className="desc-box" style={{borderRadius: "10px"}} value={reviewText} onChange={(event) => setReviewText(event.target.value)}></textarea>
					<button type="submit" className="confirm">Submit </button>
				</form>
				</div>

				<div className="review-form-back">
				<button className="close" onClick={() => closeReviewContainer()}>&#215;</button>
				</div>

          		</div>
    		</div>
    	</div>
    	</>


  	) 


}

export default Home

