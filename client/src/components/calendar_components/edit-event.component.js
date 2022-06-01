import React, { Component } from "react";
import { set, getYear, getMonth, getDate, isEqual } from "date-fns";
import DatePicker from "react-datepicker";
import EventService from "../../services/event.service";

class EditEvent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: this.props.selectedEvent.title,
            startDate: this.props.selectedEvent.start,
            endDate: this.props.selectedEvent.end,
            startTime: this.props.selectedEvent.start,
            endTime: this.props.selectedEvent.end,
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
        }

        this.reset = this.reset.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleEditEvent = this.handleEditEvent.bind(this)
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this)
    }

    reset() {
        this.setState({
            title: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            days: {mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false},
        })
    }

    
    handleClose() {
        this.reset()
        this.props.setIsEdit(false)
        this.props.setTrigger(false)
    }
    
    async handleEditEvent() {
        const { title, startDate, endDate, startTime, endTime } = this.state

        const start = set(startTime, {year: getYear(startDate), month: getMonth(startDate), date: getDate(startDate)})
        const end = set(endTime, {year: getYear(endDate), month: getMonth(endDate), date: getDate(endDate)})

        if (this.props.selectedEvent.title !== title ||
            !isEqual(this.props.selectedEvent.start, start) ||
            !isEqual(this.props.selectedEvent.end, end)) {
            
            if(start > end) {
                alert('The event can\'t end before it starts.')
            }
            else if(end - start < 5*60*1000) {
                alert('The event\'s minimum duration is 5 minutes.')
            }
            else {
                const r = (await EventService.editEvent(this.props.user.id, this.props.selectedEventId, {title: title, startDate: start, endDate: end}))
    
                if (r.status === 200) {
                    console.warn("The event succesfully edited.")
                }
                else {
                    console.warn("Failed to edit event.")
    
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
        }
        this.props.setIsSubmitted(true)
        this.handleClose()
    }

    async handleDeleteEvent() {

        const r = (await EventService.deleteEvent(this.props.user.id, this.props.selectedEventId))

        if (r.status === 200) {
            console.warn("The event succesfully deleted.")
        }
        else {
            console.warn("Failed to delete event.")
        }

        this.props.setIsSubmitted(true)
        this.handleClose()
    }

    render = () => (
        <div>
            <h2>Edit Event</h2>
            <div>
                <input
                type="text"
                placeholder={this.state.title}
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
                <button style={{marginRight: "50px"}} onClick={this.handleEditEvent}>Submit Changes</button>
                <button style={{marginRight: "50px"}} onClick={this.handleDeleteEvent}>Delete</button>
                <button onClick={this.handleClose}>Cancel</button>
                {this.props.children}
            </div>
        </div>
    );
}

export default EditEvent