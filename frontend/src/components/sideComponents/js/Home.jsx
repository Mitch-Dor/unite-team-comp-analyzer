import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

function Home() {
    const navigate = useNavigate();
    return (
        <div className="home-container" onClick={() => {
            // Send the user back to the main page
            navigate("/");
        }}>
            <FaHome className="home-icon" />
        </div>
    );
}

export default Home;
