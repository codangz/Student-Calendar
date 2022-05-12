import React from "react";
import "./popup.css";
import AddEvent from "./add-event.component";
import EditEvent from "./edit-event.component";

function SelectedPopup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                {(props.isEdit) ? 
                <EditEvent
                setAllEvents={props.setAllEvents}
                setTrigger={props.setTrigger}
                setIsEdit={props.setIsEdit}
                setIsSubmitted={props.setIsSubmitted}
                selectedEvent={props.selectedEvent}
                selectedEventId={props.selectedEventId}
                user={props.user}
                /> : 
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
                />}
                {props.children}
            </div>
        </div>
    ) : "";
}

export default SelectedPopup