import React from "react";
import "./Result.css"

const Result = ({ result }) => {
    return(
        <div className="result">
            <div>
                LOCATION: {result.location}
            </div>
            <div>
                LATITUDE: {result.latitude}
            </div>
            <div>
                LONGITUDE: {result.longitude}
            </div>
        </div>
    )
}

export default Result;