import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {
    const skills = [
        "Python",
        "C++",
        "SQL",
        "React",
        "Node.js",
        "MongoDB",
        "FastAPI",
        "TensorFlow",
        "Machine Learning",
        "Git",
        "HTML",
        "CSS"
    ];

    return (
        <>
            <Header
                name="Vyoma Patel"
                role="Computer Science Student | Aspiring Data Scientist"
            />

            <About />

            <Skills skillList={skills} />

            <Footer />
        </>
    );
}

export default Home;