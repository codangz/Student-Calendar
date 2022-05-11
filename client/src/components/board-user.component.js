import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Calendar from "./calendar-ui.component";

export default class BoardUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: "",
    }
  }

  componentDidMount() {
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
    return (
      <div className="App">
        <h1>Student Calendar</h1>
        <Calendar/>
      </div>
    );
  }
}
