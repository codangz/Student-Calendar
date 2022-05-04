import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import React, { useState, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import SelectedPopup from "./components/SelectedPoppup";

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

const CalendarUI = () => {
  const [popupAlert, setPopupAlert] = useState(false)
  const [isAddClass, setIsAddClass] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState(null)

  const [allEvents, setAllEvents] = useState(myEvents)

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
      <Calendar
      localizer={localizer}
      events={allEvents}
      startAccessor="start"
      endAccessor="end"
      style ={{height : 800, margin : "50px"}}
      onSelectSlot={onSelectSlot}
      selectable
      />
      <SelectedPopup
      setAllEvents={setAllEvents}
      trigger={popupAlert}
      setTrigger={setPopupAlert}
      isAddClass={isAddClass}
      setIsAddClass={setIsAddClass}
      selectedInfo={selectedInfo}
      />
    </div>
  )
}

export default CalendarUI;
