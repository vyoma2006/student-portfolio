import { useState } from "react";

function Contact() {
    const [message, setMessage] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="page">
            <h1>Contact</h1>

            <input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <p>Your Message: {message}</p>

            <button onClick={() => setShowHelp(!showHelp)}>
                {showHelp ? "Hide Help" : "Show Help"}
            </button>

            {showHelp && (
                <p>You can leave your message here.</p>
            )}
        </div>
    );
}

export default Contact;