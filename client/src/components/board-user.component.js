import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Calendar from "./calendar-ui.component";
//
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventService from "../services/event.service";
//
export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      //
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      events: []
      //
    };
  }

  componentDidMount() {
    //
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })

    EventService.getEvents(currentUser.id).then(
      (result) => {
        const calendarEvents = []
        result.events.forEach(element => {
          calendarEvents.push({
            title: element.title,
            start: new Date(element.startDate),
            end: new Date(element.endDate)
          })
        });
        this.setState({events: calendarEvents})
      }
    );

    //
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    //
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    const { currentUser } = this.state;
    //const { events } = this.state;

    console.warn("events: ", this.state.events)
    //
    return (
      <div className="App">
        <h1>Student Calendar</h1>
        <Calendar events={this.state.events} user={currentUser}/>
      </div>
    );
  }
}
