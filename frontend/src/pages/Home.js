import { Route } from "react-router-dom"
import * as tf from '@tensorflow/tfjs';
import NavBar from "./NavBar"

function Home(){

    
    return(
        <>
        <NavBar/>
         <div className="home">
            <h2>Home</h2>
        </div>
        </>
       
        
    )
}

export default Home

