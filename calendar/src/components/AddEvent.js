import React, { useState } from "react";
import { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday, addDays, set, getYear, getMonth, getDate, getHours, getMinutes, isEqual, toDate, setHours, setMinutes } from "date-fns";
import DatePicker from "react-datepicker";

function AddEvent(props) {
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [days, setDays] = useState({mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false})

    const [newEvent, setNewEvent] = useState({title: "", start: props.selectedInfo.start, end: props.selectedInfo.start})

    function handleAddClass() {
        for (let currentDate = toDate(startDate); !isEqual(currentDate,endDate); currentDate = addDays(currentDate, 1)) {
            if ((days.mon && isMonday(currentDate)) ||
            (days.tue && isTuesday(currentDate)) ||
            (days.wed && isWednesday(currentDate)) ||
            (days.thu && isThursday(currentDate)) ||
            (days.fri && isFriday(currentDate)) ||
            (days.sat && isSaturday(currentDate)) ||
            (days.sun && isSunday(currentDate))) {
                props.setAllEvents(currentElements => [...currentElements, {
                    title: name,
                    start: set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                    end: set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                }])
            }
        }
        console.warn("Class Added")
    }

    function handleAddEvent() {
        props.setAllEvents((currentEvents => [...currentEvents, newEvent]))
        console.warn("Event Added")
    }

    return (props.isAddClass) ? (
        <div>
            <h2>Add Class</h2>
            <div>
                <input
                type="text"
                placeholder="Class Title"
                style={{ width: "95%"}}
                selected={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <br></br>
            <div>
                <table align="center">
                    <tbody>
                        <tr>
                            <td align="right">Start Date</td>
                            <td>
                                <DatePicker
                                placeholderText="Start Date"
                                style={{ mariginRight: "10px"}}
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                />
                            </td>
                            <td align="right">End Date</td>
                            <td>
                                <DatePicker
                                placeholderText="End Date"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                minDate={startDate}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td align="right">From</td>
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
                            <td align="right">To</td>
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
                        </tr>
                    </tbody>
                </table>
            </div>
            <br></br>
            <div>
                <div>Days of the Week</div>
                <br></br>
                <div>
                    <span style={{marginRight: "5px"}}>
                        <label>Mo</label>
                        <input type="checkbox" name="Monday" id="Monday"
                        selected={days.mon}
                        onChange={(day) => setDays({...days, mon: day.target.checked})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Tu</label>
                        <input type="checkbox" name="Tuesday" id="Tuesday"
                        selected={days.tue}
                        onChange={(day) => setDays({...days, tue: day.target.checked})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>We</label>
                        <input type="checkbox" name="Wednesday" id="Wednesday"
                        selected={days.wed}
                        onChange={(day) => setDays({...days, wed: day.target.checked})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Th</label>
                        <input type="checkbox" name="Thursday" id="Thursday"
                        selected={days.thu}
                        onChange={(day) => setDays({...days, thu: day.target.checked})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Fr</label>
                        <input type="checkbox" name="Friday" id="Friday"
                        selected={days.fri}
                        onChange={(day) => setDays({...days, fri: day.target.checked})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Sa</label>
                        <input type="checkbox" name="Saturday" id="Saturday"
                        selected={days.sat}
                        onChange={(day) => setDays({...days, sat: day.target.checked})}
                        />
                    </span>
                    <span>
                        <label>Su</label>
                        <input type="checkbox" name="Sunday" id="Sunday"
                        selected={days.sun}
                        onChange={(day) => setDays({...days, sun: day.target.checked})}
                        />
                    </span>
                </div>
            </div>
            <br></br>
            <br></br>
            <div>
                <button
                style={{marginRight: "50px"}}
                onClick={() => {
                    handleAddClass()
                    props.setTrigger(false)
                }} >Submit</button>
                <button onClick={() => {
                        props.setTrigger(false)
                        props.setIsAddClass(false)
                    }
                }>Cancel</button>
                {props.children}
            </div>
        </div>
    ) : (
        <div>
            <h2>Add Event</h2>
            <div>
                <input
                type="text"
                placeholder="Event Name"
                style={{ width: "95%"}}
                selected={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
            </div>
            <br></br>
            <div>
                <table align="center">
                    <tbody>
                        <tr>
                            <td align="right">Start Date</td>
                            <td>
                                <DatePicker
                                placeholderText="Start Date"
                                style={{ mariginRight: "10px"}}
                                selected={newEvent.start}
                                onChange={(date) => setNewEvent({...newEvent, start: date})}
                                />
                            </td>
                            <td align="right">End Date</td>
                            <td>
                                <DatePicker
                                placeholderText="End Date"
                                selected={newEvent.end}
                                onChange={(date) => setNewEvent({...newEvent, end: date})}
                                minDate={newEvent.start}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td align="right">From</td>
                            <td>
                                <DatePicker
                                style={{ mariginRight: "10px"}}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="Start Time"
                                selected={newEvent.start}
                                onChange={(time) => setNewEvent({...newEvent, start: time})}
                                />
                            </td>
                            <td align="right">To</td>
                            <td>
                                <DatePicker
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="End Time"
                                selected={newEvent.end}
                                onChange={(time) => setNewEvent({...newEvent, end: time})}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br></br>
            <br></br>
            <div>
                <button
                style={{marginRight: "50px"}}
                onClick={() => {
                    handleAddEvent()
                    props.setTrigger(false)
                }}>Submit</button>
                <button onClick={() => {
                        props.setTrigger(false)
                    }
                }>Cancel</button>
                {props.children}
            </div>
        </div>
    );
}

export default AddEvent