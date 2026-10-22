import { Routes, Route } from "react-router-dom";
import "./App.css";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Tasks from "./pages/Tasks";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
    return (
        <Routes>
            {/* Public: standalone pages, no nav bar */}
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />

            {/* Private: nav bar + pages, only when logged in */}
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tasks" element={<Tasks />} />
            </Route>
        </Routes>
    );
}

export default App;