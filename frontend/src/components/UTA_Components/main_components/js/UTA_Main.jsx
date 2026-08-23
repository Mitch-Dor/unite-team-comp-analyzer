import TileBackground from "../../helper_components/TileBackground";
import "../css/UTA_Main.css";

export default function UTA_MAIN() {
    
    return (
        <div className='UTA-Main-Page-Container'>
            <img className='UTA-Logo' src='assets/UTA.png' />
            <div className='Directory-Button-Container'>
                <button className='UTA-Directory-Button'>Draft Practice</button>
                <button className='UTA-Directory-Button'>Draft Plans</button>
                <button className='UTA-Directory-Button'>Draft Review</button>
                <button className='UTA-Directory-Button'>VOD Review</button>
                <button className='UTA-Directory-Button'>Tier List</button>
            </div>
            <TileBackground />
        </div>
    )
}