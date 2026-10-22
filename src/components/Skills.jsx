const CHIP_COLORS = ["c1", "c2", "c3", "c4"];
const ROTATIONS = ["-4deg", "3deg", "-2deg", "4deg", "-3deg", "2deg"];
const PARTICLE_COLORS = ["#FF5D73", "#16B3A3", "#FFC93C", "#7B6EF0"];

function Skills({ skillList }) {
    const handleClick = (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;

        const rect = chip.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top;

        for (let i = 0; i < 10; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.background =
                PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
            p.style.left = `${cx}px`;
            p.style.top = `${cy}px`;
            document.body.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 50;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 30;

            p.animate(
                [
                    { transform: "translate(0,0) scale(1)", opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0 },
                ],
                { duration: 650 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.4,1)" }
            );

            setTimeout(() => p.remove(), 1000);
        }
    };

    return (
        <section className="skills">
            <div className="section-head">
                <span className="eyebrow">Toolbox</span>
                <h2>Skills</h2>
                <svg className="squiggle" width="120" height="12" viewBox="0 0 120 12">
                    <path
                        d="M2 8 Q 15 2, 30 8 T 60 8 T 90 8 T 118 8"
                        stroke="#16B3A3"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="skills-container" onClick={handleClick}>
                {skillList.map((skill, i) => (
                    <button
                        type="button"
                        className={`chip ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                        style={{ "--r": ROTATIONS[i % ROTATIONS.length] }}
                        key={skill}
                    >
                        {skill}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default Skills;
