import React from "react";
import "./popup.css";
import AddEvent from "./add-event.component";

function SelectedPopup(props) {
    
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <AddEvent 
                setAllEvents={props.setAllEvents}
                setTrigger={props.setTrigger}
                isAddClass={props.isAddClass}
                setIsAddClass={props.setIsAddClass}
                setIsSubmitted={props.setIsSubmitted}
                selectedInfo={props.selectedInfo}
                user={props.user}
                //
                allEvents={props.allEvents}
                //
                />
                {props.children}
            </div>
        </div>
    ) : "";
}

export default SelectedPopup