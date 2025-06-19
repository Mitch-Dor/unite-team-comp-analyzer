import React from 'react';
import '../css/report.css';

function Report() {
    return (
        <div id="miniPopupContainer">
            <div id="miniPopup">
                {/* Have one popup component that has just this shell that is just the black box. Then have it build something specific based off what was clicked */}
                <div id="reportInformationContainer">
                    <div id="ReportTypeContainer" className="reportInfo">
                        <label htmlFor="typeOfIssue">Type of Issue: </label>
                        <select name="typeOfIssue" id="typeOfIssue">
                            <option value="visual">Visual</option>
                            <option value="navigation">Navigation</option>
                            <option value="score">Score</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div id="subjectContainer" className="reportInfo">
                        <label htmlFor="subject">Subject: </label>
                        <input type="text" id="subject"></input>
                    </div>
                    <div id="descriptionContainer" className="reportInfo">
                        <label htmlFor="description">Description: </label>
                        <input type="text" id="description"></input>
                    </div>
                    <button id="submitBTN">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default Report;