import {Link} from "react-router-dom"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'


import '../css/Signup.css'
import "../css/General.css"

function SignUp(){

    const [username, setUsername] = useState('');
    const [checkUsername, setCheckUsername] = useState('');

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [checkName, setCheckName] = useState('');

    const [email, setEmail] = useState('');
    const [checkEmail, setCheckEmail] = useState('');

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordconfirm] = useState('');
    const [checkPass, setCheckPass] = useState('');
    
    const navigate = useNavigate();




    // const [users, setUsers] = useState([]);
    // const [temp, setTemp] = useState([]);

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

    const checkUserNameExists = async(username) => {
      //check if username exists
      try{
       const response = await axios.get(`http://localhost:3003/api/users/${username}`);
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
    
    const handleSignUp = async(event) => {
      event.preventDefault();

      let check =  await checkEmailExists(email);
      let checkName = await checkUserNameExists(username);

      //debug
      // console.log("the function return is", check);
      // console.log("the function  user return is", checkName);
      
      //check for empty values
      switch (true) {
        //check if firstname contains any numbers
        case /\d/.test(firstname.trim()):
          setCheckName("intFirstname");
          return;
        //check if lastname contains any numbers
        case /\d/.test(lastname.trim()):
          setCheckName("intLastname");
          return;
        case password !== passwordConfirm:
          setCheckPass("different");
          console.log("Password does not match");
          return;
        case check === true:
          setCheckEmail(true);
          return;
        case checkName === true:
            setCheckUsername(true);
            return;
        default:
            console.log("Data not empty"); 
            // console.log(checkEmail);
            setCheckPass("");
            setCheckName("");
            setCheckEmail("");
            setCheckUsername("");

            try {
                const userData = {
                  username: username,
                  firstName: firstname,
                  lastName: lastname,
                  email: email,
                  password: password,
                };
          
                const response = await fetch('/api/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userData),
                });
          
                if (response.ok) {
                  console.log('User successfully created');
                  setUsername('');
                  setFirstname('');
                  setLastname('');
                  setEmail('');
                  setPassword('');
                  setPasswordconfirm('');
                  localStorage.setItem('email', email);
                  navigate("/home");
                } else {
                  console.error('Failed to create user:', response.statusText);
                }
              } catch (error) {
                console.error('Error creating user:', error);
              }
            
            return;  
        
      }
    }
   

    return(
        <>
        <div className="signup">
            
           <div className='signup-container'>
                <form onSubmit={handleSignUp} className="signUpForm">
                    <h2>Sign Up</h2>
                    <input className="userName" value={username} onChange = {(event) => setUsername(event.target.value)} placeholder="Username" required="true"/> 
                    {checkUsername === true && <p className="errorMessage">This Username is taken. Try again</p>}

                    <br/>
                    <input className="firstName" value={firstname} onChange ={(event) => setFirstname(event.target.value)} placeholder="First name" required="true"/>
                    {checkName === "intFirstname" && <p className="errorMessage">First name should not include numbers</p>}

                    <br/>
                    <input className="lastName" value={lastname} onChange={(event) => setLastname(event.target.value)}placeholder="Last name" required="true"/> 
                    {checkName === "intLastname" && <p className="errorMessage">Last name should not include numbers</p>}

                    <br/>
                    <input className="email" value={email} onChange={(event) => setEmail(event.target.value)}placeholder="Email" required="true"/>
                    {checkEmail === true && <p className="errorMessage">This email already has an account</p>}

                    <br/>
                    <input className="passWord" value={password} onChange={(event) => setPassword(event.target.value)}placeholder="Password" required="true" type="password"/>

                    <br/>
                    <input className="passWordConfirm" value={passwordConfirm} onChange={(event) => setPasswordconfirm(event.target.value)}placeholder="Confirm Password" required="true" type="password"/>
                    {checkPass === "different" && <p className="errorMessage">Passwords do not match</p>}
                    
                    <div className='actions'>
                        <Link to="../" className="back">                        
                            {/* <button className="confirmSign">Back </button> */}
                            &larr; Back
                        </Link>
                        <button type="submit" className="confirmSign">Sign Up </button>
                    </div>
                   
                    
                </form>
           </div>
        </div>

        </>
       
        
    )
}

export default SignUp

