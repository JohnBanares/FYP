import {Link} from "react-router-dom"
import "../css/NavBar.css"

export default function NavBar(){
    return <nav className="nav">
        <Link to="/" className="title">DineDirect</Link>
        <ul>
            <li>
                <Link to="/review">Write Reviews</Link>
            </li>
        </ul>
    </nav>
}