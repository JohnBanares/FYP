import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaStar } from "react-icons/fa"
import { IoMdArrowRoundForward } from "react-icons/io";
import "../css/Home.css"
import foodImg from '../images/food.png';


// import dataTSV from '../images/Restaurant_Reviews.tsv'

import NavBar from "./NavBar"
import Maps from "./Maps"

function Home() {

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

	const [clicked, setClicked] = useState([]);
  
  	useEffect(() => {
		setClicked(Array(userReviews.length).fill(false));	
	}, [userReviews]);


  // console.log(authenticated);

  useEffect(() => {
    // Fetch restaurant data from MongoDB
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => {
        const reviewsArray = Object.values(data).flat();
        setReviews(reviewsArray);

      })
      .catch(error => {
        console.error('Error fetching restaurant data:', error);
      });
  }, []);
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

  const showReviewContainer = (place) => {
    setReviewContainer(true);
    setSelectedPlaceHome(place);
    // console.log("Selected Place:", selectedPlaceHome.);

  };

  const closeReviewContainer = () => {
    setReviewContainer(false);
};
const close = () => {
	setShowReview(close);
}
// useEffect(() => {
//   console.log("user reviews:");
//     userReviews.forEach(review => {
//         console.log("Rating:", review.rating);
//     });

// }, [userReviews]);

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


  const handleSubmit = (event) => {
    event.preventDefault();

    if (rating === null || reviewText.trim() === '') {
      console.log("Please provide a rating and review text");
      return;
    }
    const num_rating = parseFloat(rating);

    //console.log("Hey" + username )
	axios.post('http://localhost:3003/api/reviews/', {
	//   date: getCurrentDate(currentDayIndex)
		username: username,
		restaurantName: selectedPlaceHome.restaurantName,
		rating: num_rating,
		description: reviewText
	})
	.then(response => {
		console.log('Review submitted successfully');
		setRating(null);
		setReviewText('');
		setSelectedPlaceHome(null);
	})
	.catch(error => {
		console.log(error);
	});
};

	const select = (index) =>{
		const copyClickState = [...clicked];
		copyClickState[index] = !clicked[index];
		setClicked(copyClickState);
	}


	return (
    	<>
      	<NavBar />
      	<div className='home'>
        	<div className='maps'>
          	<Maps showReviewContainer={showReviewContainer} showUserReviews={showUserReviews} close={close}/>
         
          
        	{!reviewContainer && showReview && (<div  className="user-reviews-container">
           		<IoMdArrowRoundForward  className='user-reviews-container-back' onClick={() => showUserReviewsContainer()}/>
            	{userReviews.map((review, index) => (
                	<div key={index} className={`user-reviews-container-details ${clicked[index] ? 'clicked' : ''}`} onClick={() => select(index)}>
                    	<img src={foodImg} alt="temp image" height="50%" width="100%" />
                    	<div className="fields">
                        	<h3>Username: {review.username}</h3>
                        	<h3>Rating: {review.rating}</h3>
                        	<h3>Review: {review.description}</h3>
                    	</div>
                	</div>
             	 ))}   
        	</div>)}

        	<div className={`review-form ${reviewContainer ? '' : 'hidden'}`}>

				<div className='review-form-details'>
				<form onSubmit={handleSubmit} className="form">
					<p>Restaurant:</p>

					{selectedPlaceHome && (
					<p>{selectedPlaceHome.restaurantName}</p>
					)}

					<p>Rating:</p>
					<div style={{ display: 'flex', color: " yellow", marginTop: '2rem' }}>
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
					<p> Rating is {rating}</p>
					{/* <textarea className="rating-box" ></textarea> */}
					<p>Review:</p>
					<textarea className="desc-box" value={reviewText} onChange={(event) => setReviewText(event.target.value)}></textarea>
					<button type="submit" className="confirm">Submit </button>
				</form>
				</div>

				<div className="review-form-back">
				<button className="close" onClick={closeReviewContainer}>&#215;</button>
				</div>

          	</div>
    		</div>
    	</div>
    	</>


  	)


}

export default Home

