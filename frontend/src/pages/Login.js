    import {Link} from "react-router-dom"
    import { useState, useEffect } from "react"
    import axios from 'axios'

    import "../css/Login.css"

    function Login(){

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        // const [checkEmail, setCheckEmail] = useState(null);
        let check;

        // useEffect(() => {
        //     if (checkEmail !== null) {
        //         console.log(checkEmail);
        //     }
        // }, [checkEmail])

        const handleLogin = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.get(`http://localhost:3003/api/users/${email}`);
                //check if user exists
                if (response.data) {
                    check = response.data.username;
                    console.log(check);
                    
                    if(password === response.data.password)
                    {
                        console.log("logged in");   
                        // setEmail('');
                        // setPassword('');
                        // setCheckEmail('');
                    }

                }
            } 
            catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User does not exist');
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
                        <input className="emailLog"  value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email"/> 
                        <br/>
                        <input className="passWordlog" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password"/>
                        <button type="submit" className="confirmLog">Submit </button>

                    </form>

                    <p>Need an account? <Link className="signlink" to="/signup">Sign Up</Link></p>
                </div>
            
            </div>
            </>
        
            
        )
    }

    export default Login

