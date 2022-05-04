import React from "react";
import "../App.css";
import AddEvent from "./AddEvent";

function SelectedPopup(props) {
    
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <AddEvent 
                setAllEvents={props.setAllEvents}
                setTrigger={props.setTrigger}
                isAddClass={props.isAddClass}
                setIsAddClass={props.setIsAddClass}
                selectedInfo={props.selectedInfo}/>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default SelectedPopup