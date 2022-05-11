import { Calendar, dateFnsLocalizer, styles } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import React, { useState, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import SelectedPopup from "./calendar_components/selected-popup.component";

const locales = {
  "en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const myEvents = [
  {
    title : "Meeting",
    allDay : true,
    start : new Date(2022,2,1),
    end : new Date(2022,2,2)
  },
]

/*
useEffect(() => {
  //Fetch data
}) 
*/

const CalendarUI = (props) => {
  const [popupAlert, setPopupAlert] = useState(false)
  const [isAddClass, setIsAddClass] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [allEvents, setAllEvents] = useState(myEvents)

  console.warn("myEvents: ", myEvents)

  const onSelectSlot = useCallback((slotInfo) => {
    setSelectedInfo(slotInfo)
    setPopupAlert(true)
  }, [])

  return(
    <div>
      <div>
        <button style={{marginTop: "10px"}} onClick={() => {
            setIsAddClass(true)
            setPopupAlert(true)
          }
        }>Add Class</button>
      </div>
      <div className="calendar">
        <Calendar
        localizer={localizer}
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        style ={{height : 1000, margin : "10px"}}
        onSelectSlot={onSelectSlot}
        selectable
        />
      </div>
      <SelectedPopup
      setAllEvents={setAllEvents}
      trigger={popupAlert}
      setTrigger={setPopupAlert}
      isAddClass={isAddClass}
      setIsAddClass={setIsAddClass}
      selectedInfo={selectedInfo}
      user={props.user}
      />
    </div>
  )
}

export default CalendarUI;