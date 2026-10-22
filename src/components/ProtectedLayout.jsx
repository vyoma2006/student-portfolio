import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { isLoggedIn } from "../api";

// Wraps every page that needs a login (Home, Projects, Contact, Tasks).
// Not logged in  -> redirected to /login (no nav bar shown)
// Logged in      -> nav bar + the requested page
function ProtectedLayout() {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="App">
            <NavBar />
            <Outlet />
        </div>
    );
}

export default ProtectedLayout;