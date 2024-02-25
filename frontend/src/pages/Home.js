import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
// import dataTSV from '../images/Restaurant_Reviews.tsv'

import NavBar from "./NavBar"

function Home(){

    const[reviews, setReviews] = useState('');
    // const [tsvData, setTsvData] = useState([]);
    const navigate = useNavigate();
    const[authenticated, setAuthenticated] = useState('');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

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

      useEffect(() => {
        d3.tsv("/Restaurant_Reviews.tsv").then(data => {
          console.log(data); 
          const reviewText = data.slice(0, 800).map(reviews => reviews.Review);
          const testingText  = data.slice(800,1000).map(reviews => reviews.Review);
          // console.log(testingText);
          const corpus = reviewText.join(' ');

          const wordIndex = {};
          let index = 1; //keep count of words
          corpus.split(' ').forEach(word => {
              if (!wordIndex[word]) {
                  wordIndex[word] = index;
                  index++;
              }
          });
          console.log(wordIndex);
      
          // let training_padded = reviewText.map(review => 
          //   review.split(' ').map(word => wordIndex[word] || 0)); // Replace unknown words with 0
      
          // const maxLength = Math.max(...training_padded.map(seq => seq.length));
          // training_padded = training_padded.map(seq => {
          //     const padLength = maxLength - seq.length;
          //     return seq.concat(Array(padLength).fill(0)); //fill with 0
          // });

          // let testing_padded = testingText.map(review => 
          //   review.split(' ').map(word => wordIndex[word] || 0)); // Replace unknown words with 0
      
          // training_padded = training_padded.map(seq => {
          //     const padLength = maxLength - seq.length;
          //     return seq.concat(Array(padLength).fill(0)); //fill with 0
          // });
          
          //map 
          let training_padded = reviewText.map(review => {
            return review.split(' ').map(word => wordIndex[word] || 0);
          });
          let testing_padded = testingText.map(review => {
            return review.split(' ').map(word => wordIndex[word] || 0);
          });
          
          //pad
          const maxLength = Math.max(...training_padded.map(seq => seq.length));
            training_padded = training_padded.map(seq => {
            const padLength = maxLength - seq.length;
            return seq.concat(Array(padLength).fill(0));
          });
            testing_padded = testing_padded.map(seq => {
            const padLength = maxLength - seq.length;
            return seq.concat(Array(padLength).fill(0));
          });

  
          console.log(training_padded);
          console.log(testing_padded);
        });
        
      }, []);
   
      

   
    return(
    <>
    <NavBar/>
      <div className="home">
        <h2>Home</h2>
        <h2>Logged in as {email}: Username: {username}</h2>
    </div>
    </>
      
      
  )
  
  
    
}

export default Home

