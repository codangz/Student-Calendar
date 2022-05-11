import React from "react";
import { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday, addDays, set, getYear, getMonth, getDate, isEqual, toDate } from "date-fns";
//import { set, getYear, getMonth, getDate, parse } from "date-fns";
import DatePicker from "react-datepicker";
import EventService from "../../services/event.service";

class AddEvent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            title: "",
            startDate: new Date(),
            endDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
            isTimeInvalid: false, invalidMessage: ''
            /*
            newEvent : {
                title: "",
                start: (!this.props.isAddClass) ? this.props.selectedInfo.start : "",
                end: (!this.props.isAddClass) ? this.props.selectedInfo.start : ""
            }
            */
        }

        this.reset = this.reset.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleAddClass = this.handleAddClass.bind(this)
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
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false}
            /*
            newEvent : {
                title: "",
                start: (!this.props.isAddClass) ? this.props.selectedInfo.start : "",
                end: (!this.props.isAddClass) ? this.props.selectedInfo.start : ""
            }
            */
        })
    }

    handleClose() {
        this.reset()
        this.props.setIsAddClass(false)
        this.props.setTrigger(false)
    }

    // TODO: Fix the add class function
    handleAddClass() {
        const { startDate, endDate, days, title, startTime, endTime } = this.state
        //const temp = this.props.allEvents.map((x) => x)
        var count = 0
        for (let currentDate = toDate(startDate); !isEqual(currentDate,endDate); currentDate = addDays(currentDate, 1)) {
            if ((days.mon && isMonday(currentDate)) ||
            (days.tue && isTuesday(currentDate)) ||
            (days.wed && isWednesday(currentDate)) ||
            (days.thu && isThursday(currentDate)) ||
            (days.fri && isFriday(currentDate)) ||
            (days.sat && isSaturday(currentDate)) ||
            (days.sun && isSunday(currentDate))) {
                const start = set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)})
                const end = set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)})
                const r = EventService.createEvent(title, start, end, this.props.user.id, null)
                
                if (r.status === 200) {
                    console.warn("The event succesfully created: ")
                }
                else {
                    console.warn("Failed to create event.")
                }

                count++

                /*
                temp.push({
                    title: title,
                    start: set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                    end: set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)}),
                })
                */
            }
        }
        console.log("loop_count: ", count)
        //console.log("temp: ", temp)
        //this.props.setAllEvents(temp)
        //console.warn("Class Added")
        this.props.setIsSubmitted(true)
        this.handleClose()
    }

    async handleAddEvent() {
        
        const { title, startDate, endDate, startTime, endTime } = this.state

        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 
        startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
        endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())

        //console.warn("handle_start: ", start, "\nhandle_end: ", end)

        if(start > end) {
            alert('The event can\'t end before it starts.')
        }
        else if(end - start < 5*60*1000) {
            alert('The event\'s minimum duration is 5 minutes.')
        }
        else {
            const r = (await EventService.createEvent(title, start, end, this.props.user.id, null))
    
            if (r.status === 200) {
                //alert(`The event "${r.title}" was successfully created!`)
                console.warn("The event succesfully created: ")
                //this.handleClose()
            }
            else {
                console.warn("Failed to create event.")

                // conflict
                if(r.status === 409){
                    console.warn("conflict another event")
                    alert( r.message.replace(/^(.+?with\s).+$/, '$1') + 'the following events: \n' + r.overlaps.reduce(
                        (acc, cur) => ( 
                            acc + `\n  * ${cur.title} | ${new Date(cur.startDate)} - ${new Date(cur.endDate)}`
                        ), ''
                    ))
                }
                
                else if(r.status === 404){
                    alert('An error occured.')
                }
            }
        }
        this.props.setIsSubmitted(true)
        this.handleClose()
    }

    render = () => (this.props.isAddClass) ? (
        <div>
            <h2>Add Class</h2>
            <div>
                <input
                type="text"
                placeholder="Class Title"
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
                            <td align="right" >Start Date</td>
                            <td>
                                <DatePicker
                                placeholderText="Start Date"
                                style={{mariginRight: "10px"}}
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
            <div>
                <div>Days of the Week</div>
                <br></br>
                <div>
                    <span style={{marginRight: "5px"}}>
                        <label>Mo</label>
                        <input type="checkbox" name="mon" id="day"
                        selected={this.state.days.mon}
                        onChange={(day) => this.setState({days: {mon: day.target.checked}})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Tu</label>
                        <input type="checkbox" name="tue" id="day"
                        selected={this.state.days.tue}
                        onChange={(day) => this.setState({days: {tue: day.target.checked}})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>We</label>
                        <input type="checkbox" name="wed" id="day"
                        selected={this.state.days.wed}
                        onChange={(day) => this.setState({days: {wed: day.target.checked}})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Th</label>
                        <input type="checkbox" name="thu" id="day"
                        selected={this.state.days.thu}
                        onChange={(day) => this.setState({days: {thu: day.target.checked}})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Fr</label>
                        <input type="checkbox" name="fri" id="day"
                        selected={this.state.days.fri}
                        onChange={(day) => this.setState({days: {fri: day.target.checked}})}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Sa</label>
                        <input type="checkbox" name="sat" id="day"
                        selected={this.state.days.sat}
                        onChange={(day) => this.setState({days: {sat: day.target.checked}})}
                        />
                    </span>
                    <span>
                        <label>Su</label>
                        <input type="checkbox" name="sun" id="day"
                        selected={this.state.days.sun}
                        onChange={(day) => this.setState({days: {sun: day.target.checked}})}
                        />
                    </span>
                </div>
            </div>
            <br></br>
            <br></br>
            <div>
                <button style={{marginRight: "50px"}} onClick={this.handleAddClass} >Submit</button>
                <button onClick={this.handleClose}>Cancel</button>
                {this.props.children}
            </div>
        </div>
    ) : (
        <div>
            <h2>Add Event</h2>
            <div>
                <input
                type="text"
                placeholder="Event Title"
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
                <button style={{marginRight: "50px"}} onClick={this.handleAddEvent}>Submit</button>
                <button onClick={this.handleClose}>Cancel</button>
                {this.props.children}
            </div>
        </div>
    );
}

export default AddEvent