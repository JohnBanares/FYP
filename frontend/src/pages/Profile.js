import NavBar from "./NavBar";
import axios from "axios";
import { useRef, useState, useEffect } from "react"
import foodImg from "../images/food.png";
import profileImg from "../images/stock.png";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaSadCry } from "react-icons/fa";



import "../css/Profile.css";
import { backend } from "@tensorflow/tfjs";



function Profile(){
    const [userReviews, setUserReviews] = useState([]);
    const [showChangeContainer, setChangeContainer] = useState(false);
    const [showSubButtons, setSubButtons] = useState([]);
    const [showDecisionContainer, setDecisionContainer] = useState([]);
    const [usernameCopy, setUsernameCopy] = useState(localStorage.getItem('username'));
    const [emailCopy, setEmailCopy] = useState(localStorage.getItem('email'));


    // const [, setOldPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [authPass, setAuthPass] = useState(false);
    const [authMatchPass, setAuthMatchPass] = useState(false);

    const inputRef = useRef(null);
    const [readOnlyVal, setReadOnlyVal] = useState(true);
    const [detailsAuth, setdetailsAuth] = useState('');


    const [okMessage, setOkMessage] = useState(false);
    const [editInfo, setEditInfo] = useState(false);


    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    const [showEditDecision, setEditDecision] = useState([]);
    const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);

    const [editReviewRating, setEditReviewRating] = useState([]);
    const [editRatingConfirm, setEditRatingConfirm] = useState([]);
    const [readOnlyStateRating, setReadOnlyStateRating] = useState([]);
    const [inputRatingValues, setInputRatingValues] = useState([]);
    const inputRefsRating = useRef([]);
    const [revertRating, setRevertRating] = useState('');


    const [editReviewDesc, setEditReviewDesc] = useState([]);
    const [editDescConfirm, setEditDescConfirm] = useState([]);
    const [readOnlyStateDesc, setReadOnlyStateDesc] = useState([]);
    const inputRefsDesc = useRef([]);
    const [inputDescValues, setInputDescValues] = useState([]);
    const [revertDesc, setRevertDesc] = useState('');


    useEffect(() => {
        setReadOnlyStateRating(Array(userReviews.length).fill(true));
        setInputRatingValues(userReviews.map(review => review.rating));
        inputRefsRating.current = Array(userReviews.length).fill(null);

        setReadOnlyStateDesc(Array(userReviews.length).fill(true));
        inputRefsDesc.current = Array(userReviews.length).fill(null);
        setInputDescValues(userReviews.map(review => review.description));


    }, [userReviews]);

    useEffect(() => {
      const fetchUserReviews = async () => {
          try{
            const response = await axios.get(`http://localhost:3003/api/reviews/${username}`);
            //   console.log(response);
            setUserReviews(response.data);
            console.log(usernameCopy);
            console.log(username);

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
                <h3>
                    Rating: 
                    <input type="text" value={inputRatingValues[index]}  
                            ref={(inputElement) => (inputRefsRating.current[index] = inputElement)} 
                            readOnly={readOnlyStateRating[index]}
                            style={{ backgroundColor: "#fffff0", border: "none", margin: "0", width: "70%"}}
                            onChange={(event) => handleChangeRating(index, event.target.value)}
                    />
                    {editReviewRating[index] && (
                        <CiEdit  style={{ cursor: "pointer",  margin: "0 10px" }} 
                        onClick={() => handleEditReviewDetailRating(index)}/>
                    )}
                    {editRatingConfirm[index] &&
                        (<FaCheck style ={{color: "rgb(94, 187, 94)", cursor: "pointer"}}  
                        onClick={() => handleEditRatingConfirm(index)}/>
                    )}
                </h3>
                <h3>
                    Review: 
                    <input type="text" value={inputDescValues[index]}  
                           ref={(inputElement) => (inputRefsDesc.current[index] = inputElement)} 
                           readOnly={readOnlyStateDesc[index]} 
                           style={{ backgroundColor: "#fffff0", border: "none", margin: "0", width: "70%", textOverflow: "ellipsis"}}
                           onChange={(event) => handleChangeDesc(index, event.target.value)}/>
                    {editReviewDesc[index] && (
                        <CiEdit  style={{ cursor: "pointer",  margin: "0 10px" }} 
                        onClick={() => handleEditReviewDetailDesc(index)}/>
                    )}
                     {editDescConfirm[index] &&
                        (<FaCheck style ={{color: "rgb(94, 187, 94)", cursor: "pointer"}}  
                        onClick={() => handleEditDescConfirm(index)}/>
                    )}
                </h3>

                {showEditDecision[index] && (
                    <div className="sub-buttons">
                        <button onClick={() => handleEditReviewCancel(index)} style={{ backgroundColor: "#AA4A44" }}>Cancel</button>
                        <button button onClick={() => saveReviewChanges(index, reviews.restaurantName)} style={{ backgroundColor: "rgb(94, 187, 94)" }}>Save</button>
                    </div>
                )}
                
                {showSubButtons[index] && (
                    <div className="sub-buttons">
                        <button onClick={() => handleDelete(index)}>Delete</button>
                        <button onClick={() => handleEditReview(index)}>Edit</button>
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

    //------------------------Edit Review--------------------------------------

    //when user clicks desc check mark
    const handleEditDescConfirm = (index) => {
        const copyDescConfirm = [...editDescConfirm]; 
        const newEditStates = [...readOnlyStateDesc];
        const copyReviewDesc = [...editReviewDesc]; 

        //set readonly to true
        newEditStates[index] = true;
        setReadOnlyStateDesc(newEditStates);

        //hide rating confirm
        copyDescConfirm[index] = false;
        setEditDescConfirm(copyDescConfirm);

        //show edit icon for rating
        copyReviewDesc[index] = true; 
        setEditReviewDesc(copyReviewDesc);
    }

    //when user clicks rating check mark
    const handleEditRatingConfirm = (index) => {
        const copyRatingConfirm = [...editRatingConfirm]; 
        const newEditStates = [...readOnlyStateRating];
        const copyReviewRating = [...editReviewRating]; 

        //set readonly to true
        newEditStates[index] = true;
        setReadOnlyStateRating(newEditStates);

        //hide rating confirm
        copyRatingConfirm[index] = false;
        setEditRatingConfirm(copyRatingConfirm);

        //show edit icon for rating
        copyReviewRating[index] = true; 
        setEditReviewRating(copyReviewRating);
    }

    //saving changes
    const saveReviewChanges = async(index, restaurantName) => {
        const copyInputValuesDesc = [...inputDescValues];
        const copyInputValuesRating = [...inputRatingValues];
        const copyEditDescConfirm = [...editDescConfirm];
        const copyEditRatingConfirm = [...editRatingConfirm];


        //dont allow save while description confirm is on

        const ratingChanged = copyInputValuesRating[index] !== revertRating;
        const descriptionChanged = copyInputValuesDesc[index] != revertDesc;


        if(copyEditDescConfirm[index] || copyEditRatingConfirm[index]) return;

        if(ratingChanged){
            const rating = copyInputValuesRating[index];
            try{
                const res = await axios.put(`http://localhost:3003/api/reviews//update-review-rating/${username}/${restaurantName}/${rating}`);
            }catch(error){
                console.log("no match");
                return;
            }            
        }   

        if(descriptionChanged){
            const description = copyInputValuesDesc[index];
            try{
                const res = await axios.put(`http://localhost:3003/api/reviews//update-review-description/${username}/${restaurantName}/${description}`);
            }catch(error){
                console.log("no match");
                return;
            }      
        }

        if(descriptionChanged || ratingChanged){
            window.location.reload()
        }
     


    }

    //when user clicks edit button
    const handleEditReview = (index) => {
        // console.log("editing restaurant", restaurantName);

        const copyEditDecisionState = [...showEditDecision];
        const copyShowButtons = [...showSubButtons];
        const copyEditReviewDesc = [...editReviewDesc];
        const copyReviewRating = [...editReviewRating]; 

        //check if a review container is already editing then retun else set it to editing
        if(currentlyEditingIndex === "editing") return;

        setCurrentlyEditingIndex("editing");

    
        //show edit icon for description
        copyEditReviewDesc[index] = true;
        setEditReviewDesc(copyEditReviewDesc);

        //show edit icon for rating
        copyReviewRating[index] = true; 
        setEditReviewRating(copyReviewRating);

        //show cancel and save buttons
        copyEditDecisionState[index] = true;
        setEditDecision(copyEditDecisionState);

        //hide delete and edit buttons
        copyShowButtons[index] = false;
        setSubButtons(copyShowButtons);

        //save state of rating before change
        setRevertRating(inputRatingValues[index]);

        //save state of desc before change
        setRevertDesc(inputDescValues[index]);
            
    };

    //when user cancels
    const handleEditReviewCancel = (index) => {
        // console.log("deleting reviews", review);

        const copyReviewRating = [...editReviewRating]; 
        const copyEditDecisionState = [...showEditDecision];
        const copyShowButtons = [...showSubButtons];
        const copyEditReviewDesc = [...editReviewDesc];
        const copyRatingConfirm = [...editRatingConfirm]; 
        const copyDescConfirm = [...editDescConfirm]; 


        //hide rating confirm
        copyRatingConfirm[index] = false;
        setEditRatingConfirm(copyRatingConfirm);

        //hide desc confirm
        copyDescConfirm[index] = false;
        setEditDescConfirm(copyDescConfirm);

        //hide edit icon for description
        copyEditReviewDesc[index] = false;
        setEditReviewDesc(copyEditReviewDesc);

        //hide edit icon for rating
        copyReviewRating[index] = false; 
        setEditReviewRating(copyReviewRating);

        //hide cancel save buttons
        copyEditDecisionState[index] = false;
        setEditDecision(copyEditDecisionState);

        //show delete and edit buttons
        copyShowButtons[index] = true;
        setSubButtons(copyShowButtons);

        //revert rating changes
        const copyInputValuesRating = [...inputRatingValues];
        copyInputValuesRating[index] = revertRating;
        setInputRatingValues(copyInputValuesRating);

        //revert desc changes
        const copyInputValuesDesc = [...inputDescValues];
        copyInputValuesDesc[index] = revertDesc;
        setInputDescValues(copyInputValuesDesc);

        //set rating input back to read only
        const newEditStates = [...readOnlyStateRating];
        newEditStates[index] = true;
        setReadOnlyStateRating(newEditStates);

        //set desc input back to read only
        const newEditStatesDesc = [...readOnlyStateDesc];
        newEditStatesDesc[index] = true;
        setReadOnlyStateDesc(newEditStatesDesc);

        //set currenteditingindex to null to indicate that another can be edited
        setCurrentlyEditingIndex(null);
            
    };

    //when user clicks to edit field
    const handleEditReviewDetailRating = (index) => {

        const copyRatingConfirm = [...editRatingConfirm]; 
        const copyReviewRating = [...editReviewRating]; 

        //show rating confirm
        copyRatingConfirm[index] = true;
        setEditRatingConfirm(copyRatingConfirm);

        //hide edit rating icon
        copyReviewRating[index] = false; 
        setEditReviewRating(copyReviewRating);

        //allow user input
        const newEditStates = [...readOnlyStateRating];
        newEditStates[index] = false;
        setReadOnlyStateRating(newEditStates);


        if (!newEditStates[index]) {
            inputRefsRating.current[index].focus();
        }
    };

    //when user clicks to edit field
    const handleEditReviewDetailDesc = (index) => {

        const copyReviewDesc = [...editReviewDesc]; 
        const copyDescConfirm = [...editDescConfirm]; 

        //show desc confirm
        copyDescConfirm[index] = true;
        setEditDescConfirm(copyDescConfirm);

        //hide edit rating icon
        copyReviewDesc[index] = false; 
        setEditReviewDesc(copyReviewDesc);


        //allow user input
        const newEditStates = [...readOnlyStateDesc];
        newEditStates[index] = false;
        setReadOnlyStateDesc(newEditStates);


        if (!newEditStates[index]) {
            inputRefsDesc.current[index].focus();
        }
    };

    // keep tracking of input field rating
    const handleChangeRating = (index, value) => {
        const newInputValues = [...inputRatingValues];
        newInputValues[index] = value;
        setInputRatingValues(newInputValues);
    };

    // keep tracking of input field desc
    const handleChangeDesc = (index, value) => {
        const newInputDescValues = [...inputDescValues];
        newInputDescValues[index] = value;
        setInputDescValues(newInputDescValues);
    };
    
    //------------------------Delete Review------------------------------------------------------------------------------------

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

    //---------------------Change Password -----------------------------------------------------------------------------------

    const handleShowChange = () => {
        const state = showChangeContainer;
        if(state){
            setOldPass('');
            setAuthPass('');
            setChangeContainer(false);
        }
        else{
            setChangeContainer(true);
        }   
    }

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
                    try{
                        const res = await axios.put(`http://localhost:3003/api/users/${username}/${newPass}`);
                        setAuthMatchPass(false);
                        setChangeContainer(false);
                        setOkMessage(true);

                    }catch(error){
                        console.log("no match");
                        return;
                    }
                    // setChangeContainer(true);
                }
                else{
                    console.log("no match");
                    setAuthMatchPass(true);
                    return;
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

    // 

    const handleOkMessage = () => {
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
        if(okMessage){
            setOkMessage(false);            
        }
        else{
            setOkMessage(true);
        }
    };

    // ----------------------------Edit Profile Info ----------------------------------------------------------
    const handleEditClick = () => {
        if(editInfo){
            setEditInfo(false);            
        }
        else{
            setEditInfo(true);
        }
    };

    const handleEditDetailsClick = () => {
        inputRef.current.focus();
        setReadOnlyVal(false);
    };

    const handleSaveDetails = async() => {
        console.log("usernaeCopy si", usernameCopy);
        console.log("username is",username);

        console.log("emailcopy si", emailCopy);
        console.log("email is",email);

        // const response = await axios.get(`http://localhost:3003/api/users`);

        // console.log(response.data);

        const usernameChanged = username !== usernameCopy;
        const emailChanged = email !== emailCopy;

        if(usernameChanged){
            let checkName = await checkUserNameExists(usernameCopy);
            if (checkName){
                console.log("this username exists");
                setdetailsAuth("UserExists");
                return;
            }
        }
        if(emailChanged){ 
            let checkEmail = await checkEmailExists(emailCopy);
            if(checkEmail){
                console.log("this email exists");
                setdetailsAuth("EmailExists");
                return;
            }
        }

        setdetailsAuth("noDups");  
        if(usernameChanged){ 
            try{
                const response = await axios.put(`http://localhost:3003/api/users/${username}/update-username/${usernameCopy}`);
                
                if (response.status === 200) {
                    
                    try{
                        const response2 = await axios.put(`http://localhost:3003/api/reviews/${username}/${usernameCopy}`);

                        if(response2.status === 200){
                                console.log("Update success");
                                localStorage.setItem("username", usernameCopy);
                                await setUsernameCopy('');
                        }else{
                            console.log("Update failed reviews name with status:", response.status);   
                        }
                    }catch(error){
                        console.log("error");
                    }
                } else {
                    console.log("Update failed username with status:", response.status);
                }
            }catch(error){
                console.log("update failled");
                return;
            }
        }

        if(emailChanged){
            try{
                const response = await axios.put(`http://localhost:3003/api/users/${username}/update-email/${emailCopy}`);
                
                if (response.status === 200) {
                    console.log("Update success");
                    localStorage.setItem("email", emailCopy);
                    await setEmailCopy('');
                } 
            }catch(error){
                console.log("update failled");
                return;
            }

        }

        if (usernameChanged || emailChanged) {
            window.location.reload();
        }
   

        setEditInfo(false);
    };
    const checkUserNameExists = async(username) => {
        //check if username exists
        try{
         const response = await axios.get(`http://localhost:3003/api/users/checkUsername/${username}`);
         //check if user exists
         return !!response.data; 
       }catch(error){
         if (error.response && error.response.status === 404) {
           return false;
         } else {
             console.error('Unexpected error:', error);
         }
       }
    }

    const checkEmailExists = async(email) => {
        //check if email exists
        try{
         const response = await axios.get(`http://localhost:3003/api/users/${email}`);
         //check if user exists
         if (response.data) {
             return true;
         }
       }catch(error){
         if (error.response && error.response.status === 404) {
           return false;
         } else {
             console.error('Unexpected error:', error);
         }
       }
    }

  
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
                                    <input type="text" value={usernameCopy}  ref={inputRef} readOnly={readOnlyVal} onChange={(event) => setUsernameCopy(event.target.value)}/>
                                    {editInfo && (
                                        <CiEdit className="ci-edit" onClick={handleEditDetailsClick}/>
                                    )}
                                </label>
                               {detailsAuth === "UserExists" && ( <p className="errorMessage" style={{ fontSize: ".9rem" }}>
                                    Username already exists
                                </p> )}
                                <label>
                                    Email: 
                                    <input type="email" value={emailCopy} ref={inputRef} readOnly={readOnlyVal} onChange={(event) => setEmailCopy(event.target.value)} /> 
                                    {editInfo && (
                                        <CiEdit className="ci-edit"  onClick={handleEditDetailsClick}/>
                                    )}
                                </label>
                               {detailsAuth === "EmailExists" &&( <p className="errorMessage" style={{ fontSize: ".9rem" }}>
                                    Email already exist
                                </p> )}
                              
                                {editInfo && (<button onClick={() => handleSaveDetails()}  style={{ backgroundColor: "rgb(94, 187, 94)" }}>Save</button>)}
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

  