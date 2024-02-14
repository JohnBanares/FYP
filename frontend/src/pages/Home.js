import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState } from 'react'
import NavBar from "./NavBar"

function Home(){

    const[reviews, setReviews] = useState('')
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    useEffect(() => {
        // Fetch restaurant data from MongoDB
        fetch('/api/reviews')
          .then(response => response.json())  
          .then(data => {
            setReviews(data);
            
          })
          .catch(error => {
            console.error('Error fetching restaurant data:', error);
          });
      }, []);
      console.log("reviews", reviews);
    
    console.log(reviews);

    
    
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

