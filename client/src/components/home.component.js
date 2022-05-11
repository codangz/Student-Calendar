import React, { Component } from "react";

import UserService from "../services/user.service";
import preview from './calendar_preview.png';

import FeaturesSplit from './landing/components/sections/FeaturesSplit';
import Hero from "./landing/components/sections/Hero";
import scss from "./landing/assets/scss/style.scss";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div class="center">
        <Hero className="illustration-section-01" />
        <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
        </div>
    );
  }

  // render() {
  //   return (
  //     <div class="center">
  //       <h1>Welcome to our student calendar!</h1>
  //       <br/>
  //       <h3>Keep track of your class schedules by generating them on your very own calendar.</h3>
  //       <br/>
  //       <h5>Don't have an account? <a href={'/register'}>Sign Up</a></h5>
  //       <h5>Already have an account? <a href={'/login'}>Log In</a></h5>
  //       <br/>
  //       <img src={preview} alt="Calendar Preview" className='imageBorder'/>
  //     </div>
  //   );
  // }
}
