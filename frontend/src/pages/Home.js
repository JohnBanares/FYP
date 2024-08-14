import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaStar } from "react-icons/fa"
import { IoMdArrowRoundForward } from "react-icons/io";
import "../css/Home.css"
import foodImg from '../images/food.png';
import { useJsApiLoader } from '@react-google-maps/api';
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
		setReviewContainer(true);
		setSelectedPlaceHome(place);
	};

	const closeReviewContainer = () => {
		setReviewContainer(false);
		setSelectedPlaceHome(null);
		setSelectedPlaceHome(null);
	};


	//wrtie review from api restaurants
	const showReviewContainerType = (place) => {
    	setReviewContainer(true);
    	setSelectedPlaceHomeType(place);

	};

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
	


		// axios.post('http://localhost:3003/api/reviews/', {
		// username: username,
		// restaurantName: selectedPlaceHomeType.name,
		// rating: num_rating,
		// description: reviewText
		// })
		// .then(response => {
		// 	console.log('Review submitted successfully');
		// 	setRating(null);
		// 	setReviewText('');
		// 	setSelectedPlaceHome(null);
		// 	setSelectedPlaceHomeType(null);
		// 	return;
		// })
		// .catch(error => {
		// 	console.log(error);
		// });
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
		// axios.post('http://localhost:3003/api/reviews/', {
		// username: username,
		// restaurantName: selectedPlaceHome.restaurantName,
		// rating: num_rating,
		// description: reviewText
		// })
		// .then(response => {
		// 	console.log('Review submitted successfully');
		// 	setRating(null);
		// 	setReviewText('');
		// 	setSelectedPlaceHome(null);
		// 	setSelectedPlaceHomeType(null);
		// 	return;
		// })
		// .catch(error => {
		// 	console.log(error);
		// });
	}
};

const convertImage = (e) => {

	setReviewImage(e.target.files[0]);
	console.log(reviewImage);

}

	return (
    	<>
      	<NavBar />
      	<div className='home'>
        	<div className='maps'>
          	<Maps showReviewContainer={showReviewContainer} showReviewContainerType={showReviewContainerType} showUserReviews={showUserReviews} isLoaded={isLoaded} showAPIReviews={showAPIReviews}/>
         
          
        	{!reviewContainer && showReview && (<div  className="user-reviews-container">
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

			{/* {!reviewContainer && showReview && (<div  className="user-reviews-container">
           		<IoMdArrowRoundForward  className='user-reviews-container-back' onClick={() => showUserReviewsContainer()}/>
            	{apiReviews.map((review, index) => (
                	<div key={index} className="user-reviews-container-details">
                    	<img src={foodImg} alt="temp image" height="50%" width="100%" />
                    	<div className="fields">
                        	<h3>Username: {review.username}</h3>
                        	<h3>Rating: {review.rating}</h3>
                        	<h3>Review: {review.description}</h3>
                    	</div>
                	</div>
             	 ))}   
        	</div>)} */}

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

