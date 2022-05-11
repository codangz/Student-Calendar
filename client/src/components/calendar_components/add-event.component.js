import React, { useState } from "react";
//import { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday, addDays, set, getYear, getMonth, getDate, isEqual, toDate } from "date-fns";
import DatePicker from "react-datepicker";
import EventService from "../../services/event.service";

class AddEvent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            title: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
            isTimeInvalid: false, invalidMessage: '',
            newEvent : {
                title: "",
                start: (!this.props.isAddClass) ? this.props.selectedInfo.start : "",
                end: (!this.props.isAddClass) ? this.props.selectedInfo.start : ""
            }
        }

        this.reset = this.reset.bind(this)
        this.handleChange = this.handleChange.bind(this)
        //this.handleAddClass = this.handleAddClass.bind(this)
        this.handleAddEvent = this.handleAddEvent.bind(this)
        this.reset = this.reset.bind(this)

    }

    reset() {
        this.setState({
            title: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
            newEvent : {
                title: "",
                start: (!this.props.isAddClass) ? this.props.selectedInfo.start : "",
                end: (!this.props.isAddClass) ? this.props.selectedInfo.start : ""
            }
        })
    }

    /*
    handleClose() {

    }
    */

    
    handleChange(e) {
        const {name, value} = e.target
        
        this.setState(
            (name.includes('Date') || name.includes('Time')) 
            ? { [name]: value } 
            : { [name]: value, isTimeInvalid: false, invalidMessage: '' }
        ) 
    }


    /*
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [days, setDays] = useState({mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false})
    */

    //const [newEvent, setNewEvent] = useState({title: "", start: (!props.isAddClass) ? props.selectedInfo.start : "", end: (!props.isAddClass) ? props.selectedInfo.start : ""})

    /*
    async handleAddClass() {
        for (let currentDate = toDate(startDate); !isEqual(currentDate,endDate); currentDate = addDays(currentDate, 1)) {
            if ((days.mon && isMonday(currentDate)) ||
            (days.tue && isTuesday(currentDate)) ||
            (days.wed && isWednesday(currentDate)) ||
            (days.thu && isThursday(currentDate)) ||
            (days.fri && isFriday(currentDate)) ||
            (days.sat && isSaturday(currentDate)) ||
            (days.sun && isSunday(currentDate))) {
                props.setAllEvents(currentElements => [...currentElements, {
                    title: title,
                    start: set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                    end: set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                }])
            }
        }
        console.warn("Class Added")
    }
    */

    async handleAddEvent() {
        const { title, startDate, endDate, startTime, endTime, days, newEvent } = this.state;

        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 
        startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());

        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
        endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

        if(start > end){
            this.setState({ isTimeInvalid: true, invalidMessage: 'The event can\'t end before it starts.' })
        }
        
        else if(end - start < 5*60*1000){
            this.setState({ isTimeInvalid: true, invalidMessage: 'The event\'s minimum duration is 5 minutes.' })
        }

        else {
            const r = (await EventService.createEvent(title, start.toString(), end.toString(), this.props.user.id, null));

            if (r.status === 200) {
                alert(`The event "${r.title}" was successfully created!`)
                console.warn("The event succesfully created: ", this.state.newEvent)
                // this.handleClose()
            }
            else {
                console.warn("Failed to create event.", this.state.newEvent)
                this.setState({ isTimeInvalid: true, invalidMessage: r.message })

                // conflict
                if(r.status === 409){
                    alert( r.message.replace(/^(.+?with\s).+$/, '$1') + 'the following events: \n' + r.overlaps.reduce(
                        (acc, cur) => ( 
                            acc + `\n  * ${cur.title} | ${this.context.getDate(new Date(cur.startDate), new Date(cur.endDate))}`
                        ), ''
                    ))
                }
                
                else if(r.status === 404){
                    alert('An error occured.')
                }
            }

            //props.setAllEvents((currentEvents => [...currentEvents, newEvent]))
            //console.warn("Event Added")
        }
    }

    render = () => (this.props.isAddClass) ? (
        <div>
            <h2>Add Class</h2>
            <div>
                <input
                type="text"
                name="title"
                placeholder="Class Title"
                style={{ width: "95%"}}
                selected={this.state.title}
                onChange={this.handleChange}
                />
            </div>
            <br></br>
            <div>
                <table align="center">
                    <tbody>
                        <tr>
                            <td align="right" >Start Date</td>
                            <td>
                                <DatePicker
                                name="startDate"
                                placeholderText="Start Date"
                                style={{mariginRight: "10px"}}
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                />
                            </td>
                            <td align="right">End Date</td>
                            <td>
                                <DatePicker
                                name="endDate"
                                placeholderText="End Date"
                                selected={this.state.endDate}
                                onChange={this.handleChange}
                                minDate={this.state.startDate}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td align="right">From</td>
                            <td>
                                <DatePicker
                                name="startTime"
                                style={{ mariginRight: "10px"}}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="Start Time"
                                selected={this.state.startTime}
                                onChange={this.handleChange}
                                />
                            </td>
                            <td align="right">To</td>
                            <td>
                                <DatePicker
                                name="endTime"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                placeholderText="End Time"
                                selected={this.state.endTime}
                                onChange={this.handleChange}
                                minTime={this.state.startDate}
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
                        <input type="checkbox" name="mon" id="day"
                        selected={this.state.days.mon}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Tu</label>
                        <input type="checkbox" name="tue" id="day"
                        selected={this.state.days.tue}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>We</label>
                        <input type="checkbox" name="wed" id="day"
                        selected={this.state.days.wed}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Th</label>
                        <input type="checkbox" name="thu" id="day"
                        selected={this.state.days.thu}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Fr</label>
                        <input type="checkbox" name="fri" id="day"
                        selected={this.state.days.fri}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Sa</label>
                        <input type="checkbox" name="sat" id="day"
                        selected={this.state.days.sat}
                        onChange={this.handleChange}
                        />
                    </span>
                    <span>
                        <label>Su</label>
                        <input type="checkbox" name="sun" id="day"
                        selected={this.state.days.sun}
                        onChange={this.handleChange}
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
                    //this.handleAddClass()
                    this.props.setTrigger(false)
                    this.props.setIsAddClass(false)
                }} >Submit</button>
                <button onClick={() => {
                        this.props.setTrigger(false)
                        this.props.setIsAddClass(false)
                    }
                }>Cancel</button>
                {this.props.children}
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
                selected={this.state.title}
                onChange={(e) => this.setState({title: e.target.value})}
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
                                selected={this.state.startDate}
                                onChange={(date) => this.setState({startDate: date})}
                                />
                            </td>
                            <td align="right">End Date</td>
                            <td>
                                <DatePicker
                                placeholderText="End Date"
                                selected={this.state.endDate}
                                onChange={(date) => this.setState({endDate: date})}
                                minDate={this.state.startDate}
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
                                selected={this.state.startTime}
                                onChange={(time) => this.setState({startTime: time})}
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
                                selected={this.state.endTime}
                                onChange={(time) => this.setState({endTime: time})}
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
                    this.handleAddEvent()
                    this.props.setTrigger(false)
                    this.reset()
                }}>Submit</button>
                <button onClick={() => {
                        this.props.setTrigger(false)
                        this.reset()
                    }
                }>Cancel</button>
                {this.props.children}
            </div>
        </div>
    );
}

export default AddEvent