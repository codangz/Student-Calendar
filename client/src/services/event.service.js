import axios from "axios";
import { Component } from "react";

const API_URL = "http://localhost:8080/api/event/";

class EventService extends Component {
    constructor(props){
        super(props)    
            this.getEvents = this.getEvents.bind(this)
            this.createEvent = this.createEvent.bind(this)
            this.editEvent = this.editEvent.bind(this)
            this.deleteEvent = this.deleteEvent.bind(this)
        }
    
    async createEvent(title, startDate, endDate, userId, days) {
        console.warn("start: ", startDate, "\nend: ", endDate)
        const r = await axios.post(API_URL + userId, { title, startDate, endDate, userId, days });
        return r.data; 
    }

    async getEvents(userId) {
        const r = await axios.get(API_URL + userId);
        return r.data; 
    }

    async editEvent(userId, eventId, edits) {
        const r = (await axios.put(API_URL + `${userId}/${eventId}`, { edits })).data;
        return r; 
    }

    async deleteEvent(userId, eventId) {
        const r = (await axios.delete(API_URL + `${userId}/${eventId}`)).data;
            return r; 
    }
}
export default new EventService();

