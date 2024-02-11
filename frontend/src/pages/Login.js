import {Link} from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'


import "../css/Login.css"
import "../css/General.css"
 

function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkEmail, setCheckEmail] = useState(true);
    const [checkPass, setCheckPass] = useState(true);

    const navigate = useNavigate();
    let check;

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:3003/api/users/${email}`);
            //check if user exists
            if (response.data) {
                setCheckEmail(true);
                check = response.data.username;
                
                console.log(check);
                // check = true;
                
                if(password === response.data.password)
                {
                    setCheckPass(true);
                    // console.log("logged in");   
                    localStorage.setItem('email', email);
                    navigate("/home");
                    // console.log("local sotrage is " + localStorage.getItem('email'));   
                }
                else{
                    setCheckPass(false);
                    console.log("password incorrect");
                }

            }
        } 
        catch (error) {
            if (error.response && error.response.status === 404) {
                setCheckEmail(false);
                console.log('User does not exist');
                // console.log(checkEmail);
                // check = false;
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }
    
    
    return(
        <>
        <div className="loginPage">

            <div className="intro">
                <h1>Welcome to DineDirect</h1>
            </div>

            <div onSubmit={handleLogin} className="login">
                <form className="loginForm">
                    <h2>Login Here</h2>
                    <input className="emailLog"  value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required="true"/> 
                    <br/>
                    {!checkEmail && <p className="errorMessage">Email doesn't exist</p>}

                    <input className="passWordlog" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required="true"/>
                    {!checkPass && <p className="errorMessage">Incorrect Password</p>}
                    <button type="submit" className="confirmLog">Submit </button>

                </form>

                <p>Need an account? <Link className="signlink" to="/signup">Sign Up</Link></p>
            </div>
        
        </div>
        </>
    
        
    )
}

export default Login

