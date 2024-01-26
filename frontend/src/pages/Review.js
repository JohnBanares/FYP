import NavBar from "./NavBar"
import "../css/Review.css"
import {FaSearch, FaStar} from "react-icons/fa"
import { useState, useEffect } from "react"
function Review(){
  const[rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [selectRestaurant, setselectRestaurant] = useState('');
  const [text, setText] = useState('');
  const [searchRest, setSearch] = useState('');


  const username = "user1";

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurant data from MongoDB
    fetch('/api/restaurant')
      .then(response => response.json())  
      .then(data => {
        setRestaurants(data);
      })
      .catch(error => {
        console.error('Error fetching restaurant data:', error);
      });
  }, []);
  // console.log("restaurant", restaurants);

  // restaurants.map((restaurant) => {
  //   console.log(restaurant.restaurantName);
  // });
  function generateRestaurantList() {
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.restaurantName.toLowerCase().includes(searchRest.toLowerCase())
    );

    return filteredRestaurants.map((restaurant, index) => (
      <button
        key={index}
        className="restaurant-review"
        onClick={() => handleRestaurantClick(restaurant.restaurantName)}
      >
        <p>{restaurant.restaurantName}</p>
      </button>
    ));
  }

  const handleRestaurantClick = (temp) => {
    setselectRestaurant(temp);
  };
  
  useEffect(() => {
    console.log("selecting", selectRestaurant);
  }, [selectRestaurant]);

  const handleSubmit = async (event) => {
      event.preventDefault();
    
        try {
          if (rating === null || reviewText.trim() === '') {
            console.log("Please provide a rating and review text");
            return;
          }
          const num_rating = parseFloat(rating);

          const reviewData = {
            username,
            restaurantName: selectRestaurant,
            rating: num_rating,
            description: reviewText,
          };
    
          const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
          });
    
          if (response.ok) {
            console.log('Review submitted successfully');
            setRating(null);
            setReviewText('');
            setselectRestaurant('');
          } else {
            console.error('Failed to submit review:', response.statusText);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
        }
        // console.log("ratinf", rating); asd
        // console.log("desc", reviewText);
      };
    return(
        <>
        <NavBar />
        <div className="block">

            <div className="review-list">

                <div className="searchbar">
                    <FaSearch id="search-icon"/>
                    <input type="text" id="review-search" placeholder="Search" 
                     value={searchRest}
                     onChange={(event) => setSearch(event.target.value)}/>
                </div>

                <div className="restaurant-list">

                    {/* <div className="restaurant-review">
                        <p>afkngnqwgnjkqnrg</p>
                    </div>
                    <div className="restaurant-review">
                        <p>afkngnqwgnjkqnrg</p>
                    </div>
                    <div className="restaurant-review">
                        <p>afkngnqwgnjkqnrg</p>
                    </div>
                    <div className="restaurant-review">
                        <p>afkngnqwgnjkqnrg</p>
                    </div> */}
                    { generateRestaurantList()}

                </div>
            </div>

            <div className="review-form">

                <form onSubmit={handleSubmit} className="form">
                    <p>Restaurant:</p>
                    <p>{selectRestaurant}</p>
                    <p>Rating:</p>
                    <div style={{ display: 'flex', color:" yellow", marginTop:'2rem'}}>
                        {[...Array(5)].map((star, index) => {
                             const currentRating = index + 1;
                            return(
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
                            ) ; 
                        })}
                    </div>
                    <p> Rating is {rating}</p>
                    {/* <textarea className="rating-box" ></textarea> */}
                    <p>Review:</p>
                    <textarea className="desc-box"  value={reviewText} onChange={(event) => setReviewText(event.target.value)}></textarea>
                    <button type="submit" className="confirm">Submit </button>
                </form>

            </div>
        </div>
        </>
    )
}

export default Review

  