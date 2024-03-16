import NavBar from "./NavBar";
import axios from "axios";
import { useState, useEffect } from "react"
import foodImg from "../images/food.png";
import profileImg from "../images/stock.png";
import { CiEdit } from "react-icons/ci";


import "../css/Profile.css";
import { backend } from "@tensorflow/tfjs";



function Profile(){
    const [userReviews, setUserReviews] = useState([]);
    const [showChangeContainer, setChangeContainer] = useState(false);
    const [showSubButtons, setSubButtons] = useState([]);
    const [showDecisionContainer, setDecisionContainer] = useState([]);


    const [editInfo, setEditInfo] = useState(false);
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');


    useEffect(() => {
      const fetchUserReviews = async () => {
          try {
              const response = await axios.get(`http://localhost:3003/api/reviews/${username}`);
            //   console.log(response);
              setUserReviews(response.data);
            //   console.log(userReviews);
          } catch (error) {
              console.error('Error fetching user reviews:', error);
          }
      };

      fetchUserReviews();
    }, [username]);

    useEffect(() => {
        setSubButtons(Array(userReviews.length).fill(true));
    }, [userReviews]);

    useEffect(() => {
        setDecisionContainer(Array(userReviews.length).fill(false));
    }, [userReviews]);

    function generateReviewList(){
        return userReviews.map((reviews, index) =>(
            <div key={index} className="profile-reviews-container-sub">
                <img src={foodImg} alt="temp image" height="auto" width="100%" />           
                <h3>Restaurant Name: {reviews.restaurantName}</h3>
                <h3>Rating: {reviews.rating}</h3>
                <h3>Review: {reviews.description}</h3>
                
                {showSubButtons[index] && (
                    <div className="sub-buttons">
                        <button onClick={() => handleDelete(index)}>Delete</button>
                        <button>Edit</button>
                    </div>
                )}
                
                {showDecisionContainer[index] && (
                    <div className="errorMessage">
                        <h5>Are you sure you would like to remove this review</h5>
                        <div className="sub-buttons">
                            <button onClick={() => handleDecisionClick(index, "yes" ,reviews)} style={{ backgroundColor: "grey" }}>Yes</button>
                            <button onClick={() => handleDecisionClick(index,"no")} style={{ backgroundColor: "grey" }}>No</button>
                        </div>
                    </div>
                )}
            </div>
        ));
    }

    const handleDelete = (index) => {
        // console.log("deleting reviews", review);

        const copyButtonState = [...showSubButtons]; 
        const copyDecisionState = [...showDecisionContainer]; 

        copyButtonState[index] = false; 
        setSubButtons(copyButtonState);

        copyDecisionState[index] = true; 
        setDecisionContainer(copyDecisionState);
    };
    

   

    const handleDecisionClick = async(index,decision,reviews) => {
        // const state = showDecisionContainer[index];
        const copyButtonState = [...showSubButtons]; 
        const copyDecisionState = [...showDecisionContainer]; 

        if(decision === "yes"){
            // console.log("deleting review", reviews);

            try {
                const reviewId = reviews._id;
                console.log("id is", reviewId);
                const response = await axios.delete(`http://localhost:3003/api/reviews/${reviewId}`);

                if(response){
                    // console.log(response);

                    const copyReviews = [...userReviews];
                    const updatedReviews = copyReviews.filter(review => review._id !== reviewId);
                    setUserReviews(updatedReviews);
                    // copyButtonState[index] = true; 
                    // setSubButtons(copyButtonState);

                    // copyDecisionState[index] = false; 
                    // setDecisionContainer(copyDecisionState);

                    // window.location.reload();
                }
           
            } catch (error) {
                console.error('Error fetching user reviews:', error);
            }

        }
        else{
            copyButtonState[index] = true; 
            setSubButtons(copyButtonState);

            copyDecisionState[index] = false; 
            setDecisionContainer(copyDecisionState);
        }       
    }

    const handleShowChange = () => {
        const state = showChangeContainer;
        if(state){
            setChangeContainer(false);
        }
        else{
            setChangeContainer(true);
        }   
    }

    const handleEditClick = () => {
        if(editInfo){
            setEditInfo(false);            
        }
        else{
            setEditInfo(true);
        }
    };
//   console.log(userReviews);
    
    return(
        <>
        <NavBar />
		<div className="profile-container">
			<div className="profile-reviews-container">
				<h2>My Reviews</h2>
                {/* <div className="profile-reviews-container-sub">
                <h3>Restaurant Name:</h3>
                <h3>Rating: </h3>
                <h3>Review: </h3>
                <button>Delete</button>
                <button>Modify</button>
                </div> */}
                {generateReviewList()}

			</div>

			<div className="profile-info-container">
                <div className="profile-info-container-sub">
                    <div className="profile-info-container-top">
                        <h2> My Profile</h2>
                        <img src={profileImg} alt="temp profile image"/>
                    </div>

                    {!showChangeContainer && (
                        <div className="profile-info-container-bottom">
                            <div className="profile-info-container-bottom-text">
                                <button onClick={() => handleEditClick()}>Edit</button>
                                <label>
                                    Username: 
                                    <input type="text" value={username}  readOnly/> 
                                    {editInfo && (
                                        <CiEdit className="ci-edit"/>
                                    )}
                                </label>
                                <label>
                                    Email: 
                                    <input type="email" value={email} readOnly /> 
                                    {editInfo && (
                                        <CiEdit className="ci-edit"/>
                                    )}
                                </label>
                            </div>

                            <div className="profile-info-container-bottom-actions">
                                <button onClick={() => handleShowChange()}>Change Password</button>
                            </div>
                        </div>
                    )}
              
                    {showChangeContainer && (
                        <div className="change-password-form">
                            <button className="change-password-form-close" onClick={handleShowChange}>&#215;</button>
                            <label>Old Password: <input type="password" /></label>
                            <label>New Password: <input type="password" /></label>
                            <label>Confirm Password: <input type="password" /></label>
                            <div className="change-password-form-actions">
                                <button>Save</button>                                
                            </div>
                            {/* <button>Save</button>                                 */}
                        </div>
                    )}
                    {/* <div className="change-password-form">
                        <button>&#215;</button>
                        <label>Old Password: <input type="password" /></label>
                        <label>New Password: <input type="password" /></label>
                        <label>Confirm Password: <input type="password" /></label>
                    </div> */}
                </div>
			</div>
		</div>
        </>
    )
}

export default Profile

  