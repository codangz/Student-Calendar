import React, { Component } from "react";
import "./popup.css";
import { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday, addDays, set, getYear, getMonth, getDate, isEqual, toDate } from "date-fns";
import DatePicker from "react-datepicker";
import EventService from "../../services/event.service";

class AddEvent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: "",
            startDate: (!this.props.isAddClass) ? this.props.selectedInfo.start : new Date(),
            endDate: (!this.props.isAddClass) ? this.props.selectedInfo.start : new Date(),
            startTime: (!this.props.isAddClass) ? this.props.selectedInfo.start : new Date(),
            endTime: (!this.props.isAddClass) ? this.props.selectedInfo.end : new Date(),
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
            isLoading: false
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
            startDate: (!this.props.isAddClass) ? this.props.selectedInfo.start : new Date(),
            endDate: (!this.props.isAddClass) ? this.props.selectedInfo.start : new Date(),
            startTime: new Date(),
            endTime: new Date(),
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false}
        })
    }

    handleClose() {
        this.reset()
        this.props.setIsAddClass(false)
        this.props.setTrigger(false)
    }

    // TODO: Fix the add class function
    async handleAddClass() {
        const { startDate, endDate, days, title, startTime, endTime } = this.state
        //const temp = this.props.allEvents.map((x) => x)
        if(startTime > endTime || startDate > endDate) {
            alert('The class can\'t end before it starts.')
        }
        else if(endTime - startTime < 5*60*1000) {
            alert('The class\'s minimum duration is 5 minutes.')
        }
        else {
            this.setState({isLoading: true})
            for (let currentDate = toDate(startDate); !isEqual(currentDate,endDate); currentDate = addDays(currentDate, 1)) {
                if ((days.mon && isMonday(currentDate)) ||
                (days.tue && isTuesday(currentDate)) ||
                (days.wed && isWednesday(currentDate)) ||
                (days.thu && isThursday(currentDate)) ||
                (days.fri && isFriday(currentDate)) ||
                (days.sat && isSaturday(currentDate)) ||
                (days.sun && isSunday(currentDate))) {
                    // console.log(currentDate)
                    // const start = set(startTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)})
                    // const end = set(endTime, {year: getYear(currentDate), month: getMonth(currentDate), date: getDate(currentDate)})

                    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),
                    startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())
                    
                    const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),
                    endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())

                    const r = (await EventService.createEvent(title, start, end, this.props.user.id, null))

                    if (r.status === 200) {
                        console.warn("The event succesfully created: ")
                    }
                    else {
                        console.warn("Failed to create event.")
                        if(r.status === 409){
                            console.warn("conflict with another event")
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
            }
        }
        this.setState({isLoading: false})
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
                console.warn("The event succesfully created.")
                //this.handleClose()
            }
            else {
                console.warn("Failed to create event.")

                // conflict
                if(r.status === 409){
                    console.warn("conflict with another event")
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

    checkDay = (day) => {
        let newDays = {...this.state.days}
        newDays[day.target.name] = day.target.checked
        this.setState({days: newDays})
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
                        onChange={this.checkDay}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Tu</label>
                        <input type="checkbox" name="tue" id="day"
                        selected={this.state.days.tue}
                        onChange={this.checkDay}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>We</label>
                        <input type="checkbox" name="wed" id="day"
                        selected={this.state.days.wed}
                        onChange={this.checkDay}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Th</label>
                        <input type="checkbox" name="thu" id="day"
                        selected={this.state.days.thu}
                        onChange={this.checkDay}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Fr</label>
                        <input type="checkbox" name="fri" id="day"
                        selected={this.state.days.fri}
                        onChange={this.checkDay}
                        />
                    </span>
                    <span style={{marginRight: "5px"}}>
                        <label>Sa</label>
                        <input type="checkbox" name="sat" id="day"
                        selected={this.state.days.sat}
                        onChange={this.checkDay}
                        />
                    </span>
                    <span>
                        <label>Su</label>
                        <input type="checkbox" name="sun" id="day"
                        selected={this.state.days.sun}
                        onChange={this.checkDay}
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
            {(this.state.isLoading) ?
                <div className="popup">
                    <div className="popup-inner">
                        Generating Class Schedule...
                    </div>
                </div> 
                : ""
            }
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
