import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api";
import "../Auth.css";

function NavBar() {
    const navigate = useNavigate();
    const linkClass = ({ isActive }) => (isActive ? "active" : "");

    const handleLogout = () => {
        logout(); // clears the token
        navigate("/login", { replace: true });
    };

    return (
        <nav>
            <NavLink to="/" end className={linkClass}>
                Home
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
                Projects
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
                Contact
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
                Tasks
            </NavLink>
            <button type="button" className="nav-logout" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default NavBar;