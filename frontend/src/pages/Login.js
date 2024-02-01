import {Link} from "react-router-dom"
import "../css/Login.css"

function Login(){
    
    return(
        <>
         <div className="loginPage">

            <div className="intro">
                <h1>Welcome to DineDirect</h1>
            </div>

            <div className="login">
                <form className="loginForm">
                    <h2>Login Here</h2>
                    <input className="userName" placeholder="Username"/> 
                    <br/>
                    <input className="passWord" placeholder="Password"/>
                    <button type="submit" className="confirmLog">Submit </button>

                </form>

                <p>Need an account? <Link className="signlink" to="/signup">Sign Up</Link></p>
            </div>
           
        </div>
        </>
       
        
    )
}

export default Login

