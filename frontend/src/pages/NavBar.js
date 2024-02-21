import {Link,useNavigate} from "react-router-dom"
import "../css/NavBar.css"

export default function NavBar(){
    const navigate = useNavigate();

    function handleLogout(){
        localStorage.setItem('email', "");
        localStorage.setItem('username', "");
        localStorage.setItem('authenticated', false);
        navigate('../');
    }
    return <nav className="nav">
        <Link to="/home" className="title">DineDirect</Link>
        <ul>
            <li>
                <Link to="/review">Write Reviews</Link>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </li>
        </ul>
    </nav>
}