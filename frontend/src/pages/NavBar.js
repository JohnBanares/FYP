import {Link,useNavigate} from "react-router-dom"
import { CgProfile } from "react-icons/cg";
import { CgLogOut } from "react-icons/cg";
import {  useState } from 'react'

import "../css/NavBar.css";
import ProfileImg from "../images/profile4.png";
import LogoutImg from "../images/logout3.png";

export default function NavBar(){
    const navigate = useNavigate();

    const [showProfileContainer, setProfileContainer] = useState(false);

    function handleLogout(){
        localStorage.setItem('email', "");
        localStorage.setItem('username', "");
        localStorage.setItem('authenticated', false);
        navigate('../');
    }

    const handleProfileClick = () => {
        if(showProfileContainer){
            setProfileContainer(false);            
        }
        else{
            setProfileContainer(true);
        }
    }
    return <nav className="nav">
        <Link to="/home" className="title">DineDirect</Link>
        <ul>
            <li>
                {/* <Link to="/review">Write Reviews</Link> */}
                <CgProfile className="profile-icon" onClick={handleProfileClick}/>
                {/* <button className="logout" onClick={handleLogout}>Logout</button> */}

            </li>

            { showProfileContainer && (
                <div className="dropdown-menu">
                <div className="dropdown-menu-sub">
                    <div className="dropdown-menu-item">
                        <img src={ProfileImg} alt="Profile image" />
                        {/* <CgProfile className="icons"/> */}
                        <Link to="/profile" className="profile-icon-menu">My Profile</Link>
                        <label>&gt;</label>
                    </div>
                    <div className="dropdown-menu-item">
                        <img src={LogoutImg} alt="Logout image" />
                        {/* <CgLogOut className="icons"/> */}
                        <button className="logout" onClick={handleLogout}>Logout</button>   
                        <label>&gt;</label>
                    </div>
                </div>
            </div>
            )}

            
        </ul>
    </nav>
}