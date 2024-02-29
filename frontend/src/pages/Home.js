import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {FaSearch, FaStar} from "react-icons/fa"
import "../css/Home.css"

// import dataTSV from '../images/Restaurant_Reviews.tsv'

import NavBar from "./NavBar"
import Maps from "./Maps"

function Home(){

    const[reviews, setReviews] = useState('');
    // const [tsvData, setTsvData] = useState([]);
    const navigate = useNavigate();
    const[authenticated, setAuthenticated] = useState('');
    const[reviewContainer, setReviewContainer] = useState(false);
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    const[rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [reviewText, setReviewText] = useState('');

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

      const showReviewContainer = () => {
        setReviewContainer(true);
      };

      // useEffect(() => {
      //   d3.tsv("/Restaurant_Reviews.tsv").then(data => {
      //     console.log(data); 
      //     const reviewText = data.slice(0, 800).map(reviews => reviews.Review);
      //     const testingText  = data.slice(800,1000).map(reviews => reviews.Review);
      //     // console.log(testingText);
      //     const corpus = reviewText.join(' ');

      //     const wordIndex = {};
      //     let index = 1; //keep count of words
      //     corpus.split(' ').forEach(word => {
      //         if (!wordIndex[word]) {
      //             wordIndex[word] = index;
      //             index++;
      //         }
      //     });
      //     console.log(wordIndex);
      
      //     // let training_padded = reviewText.map(review => 
      //     //   review.split(' ').map(word => wordIndex[word] || 0)); // Replace unknown words with 0
      
      //     // const maxLength = Math.max(...training_padded.map(seq => seq.length));
      //     // training_padded = training_padded.map(seq => {
      //     //     const padLength = maxLength - seq.length;
      //     //     return seq.concat(Array(padLength).fill(0)); //fill with 0
      //     // });

      //     // let testing_padded = testingText.map(review => 
      //     //   review.split(' ').map(word => wordIndex[word] || 0)); // Replace unknown words with 0
      
      //     // training_padded = training_padded.map(seq => {
      //     //     const padLength = maxLength - seq.length;
      //     //     return seq.concat(Array(padLength).fill(0)); //fill with 0
      //     // });
          
      //     //map 
      //     let training_padded = reviewText.map(review => {
      //       return review.split(' ').map(word => wordIndex[word] || 0);
      //     });
      //     let testing_padded = testingText.map(review => {
      //       return review.split(' ').map(word => wordIndex[word] || 0);
      //     });
          
      //     //pad
      //     const maxLength = Math.max(...training_padded.map(seq => seq.length));
      //       training_padded = training_padded.map(seq => {
      //       const padLength = maxLength - seq.length;
      //       return seq.concat(Array(padLength).fill(0));
      //     });
      //       testing_padded = testing_padded.map(seq => {
      //       const padLength = maxLength - seq.length;
      //       return seq.concat(Array(padLength).fill(0));
      //     });

  
      //     console.log(training_padded);
      //     console.log(testing_padded);
      //   });
        
      // }, []);
   
      

   
    return(
    <>
    <NavBar/>
    <div className="home">
        {/* <h2>Home</h2>
        <h2>Logged in as {email}: Username: {username}</h2> */}
    </div>

    <div className='maps'>
      <Maps showReviewContainer={showReviewContainer}/>
      <div className={`review-form ${reviewContainer ? '' : 'hidden'}`}>
        <form className="form">
            <p>Restaurant:</p>
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

export default Home

