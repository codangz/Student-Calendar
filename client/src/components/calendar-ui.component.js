import { Calendar, dateFnsLocalizer, styles } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import isEqual from "date-fns/isEqual";
import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import SelectedPopup from "./calendar_components/selected-popup.component";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventService from "../services/event.service";

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

class CalendarUI extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },

      popupAlert: false,
      isAddClass: false,
      isSubmitted: false,
      isEdit: false,
      selectedInfo: null,
      selectedEvent: null,
      selectedEventId: null,
      allEvents: myEvents,
      events: [],//this.props.events
      calendarEvents: []
    }

    this.fetchEvents = this.fetchEvents.bind(this)
    //this.fetchCalendarEvents = this.fetchCalendarEvents.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
    this.onSelectEvent = this.onSelectEvent.bind(this)
  }

  componentDidMount () {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })

    this.fetchEvents(currentUser)
  }

  
  async componentDidUpdate(preProps, preState) {
    if (preState.isSubmitted === false && this.state.isSubmitted === true) {
      await this.fetchEvents(this.state.currentUser)

      //console.log("preProps: ", preProps)
      //console.log("preState_isSubmitted: ", preState.isSubmitted)
      //console.log("isSubmitted: ", this.state.isSubmitted)
      console.log("calendarEvents: ", this.state.calendarEvents)
      this.setState({isSubmitted: false})
    }
  }

  async fetchEvents(user) {
    //
    //console.log("user id: ", user.id)
    //
    await EventService.getEvents(user.id).then(
      (result) => {
        const importedEvents = []
        const cEvents = []
        result.events.forEach(element => {
          //if ()
          importedEvents.push({
            id: element._id,
            title: element.title,
            startDate: new Date(element.startDate),
            endDate: new Date(element.endDate),
            days: element.days
          })

          cEvents.push({
            title: element.title,
            start: new Date(element.startDate),
            end: new Date(element.endDate),
            allDay: false
          })
        })
        //
        //console.log("importedEvents: ", importedEvents)
        //
        this.setState({events: importedEvents, calendarEvents: cEvents})
      }
    )
  }

  onSelectSlot(slotInfo) {
    this.setState({
      selectedInfo: slotInfo,
      popupAlert: true
    })
  }

  onSelectEvent(calEvent) {
    //console.log("calEvent: ", calEvent)
    this.setState({
      selectedEventId: this.state.events.find(element => 
        element.title === calEvent.title &&
        isEqual(element.startDate, calEvent.start) &&
        isEqual(element.endDate, calEvent.end)).id,
      selectedEvent: calEvent,
      isEdit: true,
      popupAlert: true
    })
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    const { currentUser } = this.state
    const { calendarEvents } = this.state
    //
    //console.log("selectedEventId: ", this.state.selectedEventId)
    //console.log("events: ", this.state.events)
    //
    return(
      <div>
        <div>
          <button style={{marginTop: "10px"}} onClick={() => {
              this.setState({isAddClass: true})
              this.setState({popupAlert: true})
            }
          }>Add Class</button>
        </div>
        <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style ={{height : 1000, margin : "50px"}}
        onSelectSlot={this.onSelectSlot}
        onSelectEvent={this.onSelectEvent}
        selectable
        />
        <SelectedPopup
        setAllEvents={(e) => this.setState({allEvents: e})}
        trigger={this.state.popupAlert}
        setTrigger={(e) => this.setState({popupAlert: e})}
        isAddClass={this.state.isAddClass}
        setIsAddClass={(e) => this.setState({isAddClass: e})}
        isEdit={this.state.isEdit}
        setIsEdit={(e) => this.setState({isEdit: e})}
        setIsSubmitted={(e) => this.setState({isSubmitted: e})}
        selectedInfo={this.state.selectedInfo}
        selectedEvent={this.state.selectedEvent}
        selectedEventId={this.state.selectedEventId}
        user={currentUser}
        //
        allEvents={this.state.allEvents}
        //
        />
      </div>
    )
  }
}


export default CalendarUI;