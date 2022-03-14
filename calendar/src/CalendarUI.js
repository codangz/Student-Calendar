import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const CalendarUI = () => {
  const [newEvent, setNewEvent] = useState({title : "", start : "", end : ""})
  const [allEvents, setAllEvents] = useState(myEvents)

  function handleAddEvent() {
    setAllEvents([...allEvents,newEvent])
  }
  return(
    <div>
      <table style={{ marginLeft: "35%"}}>
        <tr>
          <td>
          <input
          type="text"
          placeholder="Add Title"
          style={{ width: "95%", marginRight : "120px"}}
          value={newEvent.title}
          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
          />
          </td>
          <td>
          <DatePicker
          placeholderText="Start Date"
          style={{ mariginRight: "10px"}}
          selected={newEvent.start}
          onChange={(start) => setNewEvent({...newEvent, start : start})}
          />
          </td>
          <td>
          <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          onChange={(end) => setNewEvent({...newEvent, end : end})}
          />
          </td>
        </tr>
      </table>
    <br></br><br></br>
    <div>
      Days of the Week
      <div>
        <span style={{marginRight: "5px"}}>
          <label for="Monday">Mo</label>
          <input type="checkbox" name="Monday" id="Monday"/>
        </span>
        <span style={{marginRight: "5px"}}>
          <label for="Tuesday">Tu</label>
          <input type="checkbox" name="Tuesday" id="Tuesday"/>
        </span>
        <span style={{marginRight: "5px"}}>
          <label for="Wednesday">We</label>
          <input type="checkbox" name="Wednesday" id="Wednesday"/>
        </span>
        <span style={{marginRight: "5px"}}>
          <label for="Thursday">Th</label>
          <input type="checkbox" name="Thursday" id="Thursday"/>
        </span>
        <span style={{marginRight: "5px"}}>
          <label for="Friday">Fr</label>
          <input type="checkbox" name="Friday" id="Friday"/>
        </span>
        <span style={{marginRight: "5px"}}>
          <label for="Saturday">Sa</label>
          <input type="checkbox" name="Saturday" id="Saturday"/>
        </span>
        <span>
          <label for="Sunday">Su</label>
          <input type="checkbox" name="Sunday" id="Sunday"/>
        </span>
      </div>
    </div>
      <br></br>
      <button style={{marginTop: "10px"}} onClick={handleAddEvent}>
        Add Event
      </button>
      <br></br>
      <Calendar
      localizer={localizer}
      events={allEvents}
      startAccessor="start"
      endAccessor="end"
      style ={{height : 800, margin : "50px"}} />
    </div>
  )
}

export default CalendarUI;
