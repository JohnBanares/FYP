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

    // const [, setOldPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [authPass, setAuthPass] = useState(false);
    const [authMatchPass, setAuthMatchPass] = useState(false);

    const [okMessage, setOkMessage] = useState(false);




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
            setOldPass('');
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

    const handlePasswordChange = async(event) => {
        event.preventDefault();

        try{
            const response = await axios.get(`http://localhost:3003/api/users/${username}`);

            if (newPass.trim() === '' || confirmPass.trim() === '') {
                console.log("Please fill in both new password and confirm password fields.");
                setAuthMatchPass(true);
                return;
            }

            if(response.data.password === oldPass){
                setAuthPass(false);

                if(newPass === confirmPass){
                    console.log("match");
                    setAuthMatchPass(false);
                    setChangeContainer(false);
                    setOkMessage(true);
                    // setChangeContainer(true);
                }
                else{
                    console.log("no match");
                    setAuthMatchPass(true);
                    return
                }
            }
            else{
                setAuthPass(true);
                return;
            }

        }catch (error) {
            console.error('Error fetching user reviews:', error);
        }

        // console.log(oldPass);
    };

    const handleOkMessage = () => {
        if(okMessage){
            setOkMessage(false);            
        }
        else{
            setOkMessage(true);
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

                    {!showChangeContainer && !okMessage && (
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
                                {editInfo && (<button onClick={() => handleEditClick()}  style={{ backgroundColor: "rgb(94, 187, 94)" }}>Save</button>)}
                            </div>

                            <div className="profile-info-container-bottom-actions">
                                <button onClick={() => handleShowChange()}>Change Password</button>
                            </div>
                        </div>
                    )}
              
                    {showChangeContainer && (
                       <div className="change-password-form">
                            <button className="change-password-form-close" onClick={handleShowChange}>&#215;</button>
                            
                            <label>Old Password: <input type="password" value={oldPass} onChange={(event) => setOldPass(event.target.value)} required/></label>
                            {authPass &&
                               (<p className="errorMessage" style={{ fontSize: ".9rem" }}>
                                    Failed to confirm old password
                                </p>    
                            )}

                            <label>New Password: <input type="password"  value={newPass} onChange={(event) => setNewPass(event.target.value)}/></label>
                            <label>Confirm Password: <input type="password"  value={confirmPass} onChange={(event) => setConfirmPass(event.target.value)}/></label>
                            {authMatchPass &&
                               (<p className="errorMessage" style={{ fontSize: ".9rem" }}>
                                    Passwords do not match or fields are either empty. Please try again.
                                </p>    
                            )}

                            <div className="change-password-form-actions">
                                <button onClick={handlePasswordChange}>Save</button>
                            </div>
                        </div>
                    )}

                    {okMessage && (
                        <div className="change-password-form">                            
                            <h4 style={{ color: "green"}}>Password Change was successful!</h4>
                            <div className="change-password-form-actions">
                                <button onClick={handleOkMessage}>Ok</button>
                            </div>
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

  