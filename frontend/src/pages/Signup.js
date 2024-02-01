import '../css/Signup.css'
function SignUp(){
    
    return(
        <>
        <div className="signup">
            
           <div className='signup-container'>
                <form className="signUpForm">
                    <h2>Sign Up</h2>
                    <input className="userName" placeholder="Username"/> 
                    <br/>
                    <input className="firstName" placeholder="First name"/> 
                    <br/>
                    <input className="lastName" placeholder="Last name"/> 
                    <br/>
                    <input className="email" placeholder="Email"/>
                    <br/>
                    <input className="passWord" placeholder="Password"/>
                    <br/>
                    <input className="passWordConfirm" placeholder="Confirm Password"/>
                    <div className='actions'>
                        <button className="confirmSign">Back </button>
                        <button type="submit" className="confirmSign">Sign Up </button>
                    </div>
                   
                    
                </form>
           </div>
        </div>

        </>
       
        
    )
}

export default SignUp

