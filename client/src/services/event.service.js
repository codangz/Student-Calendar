// These are the routes from events.routes.js--create a request for each backend response
// app.get('/api/event/:userId', eventController.find);
// app.post('/api/event/:userId', eventController.create);
// app.put('/api/event/:userId/:eventId', eventController.update);
// app.delete('/api/event/:userId/:eventId', eventController.delete);

import axios from "axios";
import React from "react";
import authHeader from './auth-header';
// import { set, getYear, getMonth, getDate } from "date-fns";

const API_URL = "http://localhost:8080/api/event/";

export const DataContext = React.createContext();

export class EventService extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            userId: '',
            events: []
        }
        
        this.getEvents = this.getEvents.bind(this)
        this.createEvent = this.createEvent.bind(this)
        this.editEvent = this.editEvent.bind(this)
        this.deleteEvent = this.deleteEvent.bind(this)
    }

    async createEvent(title, start, end, userId, days) {
        const start = 
        // const start = ((startTime) ? set(startTime, {year: getYear(startDate), month: getMonth(startDate), date: getDate(startDate)}) : startDate).toISOString();
        // const end = ((endTime) ? set(endTime, {year: getYear(endDate), month: getMonth(endDate), date: getDate(endDate)}) : endDate).toISOString();
        console.warn("start: ", start, "\nend: ", end)
        const r = (await axios.post(API_URL + userId, { title, start, end, userId, days })).data;

        if(r.status === 200) {
            this.setState({userId: userId});
            await this.getEvents();
        }
        return r; 
    }

    async getEvents(userId) {
        const r = (await axios.get(API_URL + userId, { headers: authHeader() })).data;

        if(r.status === 200 || r.status === 404){
            this.setState({events: r.events.map(e => {
                e.startDate = new Date(e.startDate)
                e.endDate = new Date(e.endDate)
                return e
            })})
        }

        return r;
    }

    async editEvent(userId, eventId, edits) {
        const r = (await axios.put(API_URL + `${userId}/${eventId}`, { edits })).data;
        
        if(r.status === 200){ 
            this.setState({userId: userId, events: []})
            await this.getEvents() 
        }

        return r; 
    }

    async deleteEvent(userId, eventId) {
        const r = (await axios.delete(API_URL + `${userId}/${eventId}`)).data;

        if(r.status === 200){ 
            this.setState({userId: userId});
            await this.getEvents() 
        }

        return r; 
    }

}


// class EventService {
    
//     async createEvent(title, start, end, userId, days) {
//         const start = 
//         // const start = ((startTime) ? set(startTime, {year: getYear(startDate), month: getMonth(startDate), date: getDate(startDate)}) : startDate).toISOString();
//         // const end = ((endTime) ? set(endTime, {year: getYear(endDate), month: getMonth(endDate), date: getDate(endDate)}) : endDate).toISOString();
//         console.warn("start: ", start, "\nend: ", end)
//         const r = (await axios.post(API_URL + userId, { title, start, end, userId, days })).data;
//         return r; 
//     }

//     async getEvents(userId) {
//         const r = (await axios.get(API_URL + userId, { headers: authHeader() })).data;
//         return r;
//     }

//     async editEvent(userId, eventId, edits) {
//         const r = (await axios.put(API_URL + `${userId}/${eventId}`, { edits })).data;
//         return r; 
//     }

//     async deleteEvent(userId, eventId) {
//         const r = (await axios.delete(API_URL + `${userId}/${eventId}`)).data;
            // return r; 
//     }
// }
// export default new EventService();

