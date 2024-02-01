import {Link,useNavigate} from "react-router-dom"
import "../css/NavBar.css"

export default function NavBar(){
    const history = useNavigate();

    function handleLogout(){
        history("../login");
    }
    return <nav className="nav">
        <Link to="/" className="title">DineDirect</Link>
        <ul>
            <li>
                <Link to="/review">Write Reviews</Link>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </li>
        </ul>
    </nav>
}