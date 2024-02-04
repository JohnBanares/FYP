import {Link} from "react-router-dom"
import { useState, useEffect} from "react"

import '../css/Signup.css'
function SignUp(){

    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordconfirm] = useState('');

    const [users, setUsers] = useState([]);
    const [temp, setTemp] = useState([]);
    
    useEffect(() => {
        // Fetch restaurant data from MongoDB
        fetch('/api/users')
          .then(response => response.json())  
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Error fetching restaurant data:', error);
          });
      }, []);



    const handleSignUp = async(event) => {
        event.preventDefault();
        // if(username.trim() === '' || firstname.trim() === '' || lastname.trim() === '' || email.trim() === '' || password.trim() === '' || passwordConfirm.trim() === '' ){
        //     console.log("error");
        //     return;
        // }
        // console.log(username); 
        // console.log(firstname); 
        // console.log(lastname); 
        // console.log(email); 
        // console.log(password);
        // console.log(passwordConfirm); 

        //check for empty values
        switch (true) {
            case username.trim() === '':
              console.log("Username is empty");
              return;
            case firstname.trim() === '':
              console.log("First name is empty");
              return;
            case lastname.trim() === '':
              console.log("Last name is empty");
              return;
            case email.trim() === '':
              console.log("Email is empty");
              return;
            case password.trim() === '':
              console.log("Password is empty");
              return;
            case passwordConfirm.trim() === '':
              console.log("Password confirmation is empty");
              return;
            case password !== passwordConfirm:
                console.log("Password does not match");
                return;
            default:
                // console.log("Data not empty"); 
              
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
                    <input className="userName" value={username} onChange = {(event) => setUsername(event.target.value)} placeholder="Username"/> 
                    <br/>
                    <input className="firstName" value={firstname} onChange ={(event) => setFirstname(event.target.value)} placeholder="First name"/> 
                    <br/>
                    <input className="lastName" value={lastname} onChange={(event) => setLastname(event.target.value)}placeholder="Last name"/> 
                    <br/>
                    <input className="email" value={email} onChange={(event) => setEmail(event.target.value)}placeholder="Email"/>
                    <br/>
                    <input className="passWord" value={password} onChange={(event) => setPassword(event.target.value)}placeholder="Password"/>
                    <br/>
                    <input className="passWordConfirm" value={passwordConfirm} onChange={(event) => setPasswordconfirm(event.target.value)}placeholder="Confirm Password"/>
                    <div className='actions'>
                        <Link to="../login">                        
                            {/* <button className="confirmSign">Back </button> */}
                            Back
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

