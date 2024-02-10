
import NavBar from "./NavBar"

function Home(){

    const email = localStorage.getItem('email');
    
    return(
        <>
        <NavBar/>
         <div className="home">
            <h2>Home</h2>
            <h2>Logged in as {email}</h2>
        </div>
        </>
       
        
    )
}

export default Home

