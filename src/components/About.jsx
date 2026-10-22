function About() {
    return (
        <section id="about">
            <div className="section-head">
                <span className="eyebrow">Get to know me</span>
                <h2>About Me</h2>
                <svg className="squiggle" width="120" height="12" viewBox="0 0 120 12">
                    <path
                        d="M2 8 Q 15 2, 30 8 T 60 8 T 90 8 T 118 8"
                        stroke="#FF5D73"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="about-card">
                <div className="tape"></div>
                <p>
                    I am a third-year <strong>Computer Science</strong> student at CHARUSAT with
                    an interest in <strong>Data Science</strong>, <strong>Machine Learning</strong>,
                    and <strong>Full Stack Development</strong>. I enjoy solving coding problems,
                    building practical applications, and continuously learning new technologies.
                </p>
            </div>

            <div className="facts">
                <div className="fact">
                    <span className="dotcolor"></span> <b>3rd year</b>&nbsp;at CHARUSAT
                </div>
                <div className="fact">
                    <span className="dotcolor"></span> Into <b>ML &amp; Data Science</b>
                </div>
                <div className="fact">
                    <span className="dotcolor"></span> Ships <b>full stack apps</b>
                </div>
            </div>
        </section>
    );
}

export default About;
