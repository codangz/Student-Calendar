import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
//import formatISO9075 from "date-fns/formatISO9075"
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday } from "date-fns";
import { addDays, set, getYear, getMonth, getDate, isEqual, toDate } from "date-fns/esm";

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
  const [classTitle, setTitle] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [days, setDays] = useState({mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false})
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  //const [newEvents, setNewEvents] = useState({title: "", start: "", end: ""})
  //const [allEvents, setAllEvents] = useState(myEvents)

  function handleAddEvent() {
    for (let currentDate = toDate(startDate); !isEqual(currentDate,endDate); currentDate = addDays(currentDate, 1)) {
      if ((days.mon && isMonday(currentDate)) ||
      (days.tue && isTuesday(currentDate)) ||
      (days.wed && isWednesday(currentDate)) ||
      (days.thu && isThursday(currentDate)) ||
      (days.fri && isFriday(currentDate)) ||
      (days.sat && isSaturday(currentDate)) ||
      (days.sun && isSunday(currentDate))) {
        myEvents.push({
          title: classTitle,
          start: set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
          end: set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
        })
        //console.warn("ClassAdded: ", myEvents)
      }
      //console.warn("CurrentDate: ", currentDate)
    }
    //setAllEvents([...allEvents, newEvents])
    //setAllEvents(myEvents)
    console.warn("Data:\n", myEvents)
  }
  return(
    <div>
      <span>
        <tr>
          <td>
            <input
            type="text"
            placeholder="Add Title"
            style={{ width: "95%", marginRight : "120px"}}
            selected={classTitle}
            onChange={(e) => setTitle(e.target.value)}
            />
          </td>
        </tr>
      </span>
      <br></br><br></br>
      <div>
        <span>
          <td>
            <DatePicker
            placeholderText="Start Date"
            style={{ mariginRight: "10px"}}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            />
          </td>
          <td>
            <DatePicker
            placeholderText="End Date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            />
          </td>
        </span>
      </div>
      <br></br>
      <div>
        Days of the Week
        <div>
          <span style={{marginRight: "5px"}}>
            <label for="Monday">Mo</label>
            <input type="checkbox" name="Monday" id="Monday"
            selected={days.mon}
            onChange={(day) => setDays({...days, mon: day.target.checked})}
            />
          </span>
          <span style={{marginRight: "5px"}}>
            <label for="Tuesday">Tu</label>
            <input type="checkbox" name="Tuesday" id="Tuesday"
            selected={days.tue}
            onChange={(day) => setDays({...days, tue: day.target.checked})}
            />
          </span>
          <span style={{marginRight: "5px"}}>
            <label for="Wednesday">We</label>
            <input type="checkbox" name="Wednesday" id="Wednesday"
            selected={days.wed}
            onChange={(day) => setDays({...days, wed: day.target.checked})}
            />
          </span>
          <span style={{marginRight: "5px"}}>
            <label for="Thursday">Th</label>
            <input type="checkbox" name="Thursday" id="Thursday"
            selected={days.thu}
            onChange={(day) => setDays({...days, thu: day.target.checked})}
            />
          </span>
          <span style={{marginRight: "5px"}}>
            <label for="Friday">Fr</label>
            <input type="checkbox" name="Friday" id="Friday"
            selected={days.fri}
            onChange={(day) => setDays({...days, fri: day.target.checked})}
            />
          </span>
          <span style={{marginRight: "5px"}}>
            <label for="Saturday">Sa</label>
            <input type="checkbox" name="Saturday" id="Saturday"
            selected={days.sat}
            onChange={(day) => setDays({...days, sat: day.target.checked})}
            />
          </span>
          <span>
            <label for="Sunday">Su</label>
            <input type="checkbox" name="Sunday" id="Sunday"
            selected={days.sun}
            onChange={(day) => setDays({...days, sun: day.target.checked})}
            />
          </span>
        </div>
      </div>
      <br></br>
      <div>
        <span>
          <td>
            <DatePicker
            style={{ mariginRight: "10px"}}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            placeholderText="Start Time"
            selected={startTime}
            onChange={(time) => setStartTime(time)}
            />
          </td>
          <td>
            <DatePicker
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            placeholderText="End Time"
            selected={endTime}
            onChange={(time) => setEndTime(time)}
            />
          </td>
        </span>
      </div>
      <br></br>
      <button style={{marginTop: "10px"}} onClick={handleAddEvent}>
        Add Event
      </button>
      <br></br>
      <Calendar
      localizer={localizer}
      events={myEvents}
      startAccessor="start"
      endAccessor="end"
      style ={{height : 800, margin : "50px"}} />
    </div>
  )
}

export default CalendarUI;
