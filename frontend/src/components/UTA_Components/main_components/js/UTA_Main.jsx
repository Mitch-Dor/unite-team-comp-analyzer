import { useNavigate } from 'react-router-dom';
import TileBackground from "../../helper_components/TileBackground";
import "../css/UTA_Main.css";

export default function UTA_MAIN() {
    const navigate = useNavigate();
    
    return (
        <div className='UTA-Main-Page-Container'>
            <img className='UTA-Logo' src='assets/UTA.png' />
            <div className='Directory-Button-Container'>
                <button className='UTA-Directory-Button' onClick={() => navigate('/single-draft')}>Draft Practice</button>
                <button className='UTA-Directory-Button off'>Draft Plans</button>
                <button className='UTA-Directory-Button off'>Draft Review</button>
                <button className='UTA-Directory-Button off'>VOD Review</button>
                <button className='UTA-Directory-Button' onClick={() => navigate('/tier-list')}>Tier List</button>
            </div>
            <TileBackground />
        </div>
    )
}