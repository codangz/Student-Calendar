import './App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";
import Calendar from './CalendarUI'

function App() {

  return (
    <div className="App">
      <h1>Student Calendar</h1>
      <Calendar />
    </div>
  );
}

export default App;
