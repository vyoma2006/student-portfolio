import { useEffect, useState } from "react";

function Header({ name, role }) {
    const roles = role.split("|").map((r) => r.trim());
    const [typed, setTyped] = useState("");

    useEffect(() => {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let timeoutId;

        const tick = () => {
            const word = roles[roleIndex];

            if (!deleting) {
                charIndex++;
                setTyped(word.slice(0, charIndex));
                if (charIndex === word.length) {
                    deleting = true;
                    timeoutId = setTimeout(tick, 1300);
                    return;
                }
            } else {
                charIndex--;
                setTyped(word.slice(0, charIndex));
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }
            timeoutId = setTimeout(tick, deleting ? 35 : 60);
        };

        timeoutId = setTimeout(tick, 400);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header>
            <div className="blob b1"></div>
            <div className="blob b2"></div>
            <div className="blob b3"></div>

            <div className="terminal">
                <div className="terminal-bar">
                    <span className="dot r"></span>
                    <span className="dot y"></span>
                    <span className="dot g"></span>
                </div>
                <div className="terminal-body">
                    <p className="line">
                        <span className="prompt">vyoma@portfolio</span>:~$ whoami
                    </p>
                    <h1>{name}</h1>
                    <p className="line" style={{ marginTop: "14px" }}>
                        $ role --current
                    </p>
                    <p className="type-row">
                        <span>{typed}</span>
                        <span className="cursor"></span>
                    </p>
                </div>
            </div>
        </header>
    );
}

export default Header;
