// These are the routes from events.routes.js--create a request for each backend response
// app.get('/api/event/:userId', eventController.find);
// app.post('/api/event/:userId', eventController.create);
// app.put('/api/event/:userId/:eventId', eventController.update);
// app.delete('/api/event/:userId/:eventId', eventController.delete);

import axios from "axios";
import { set, getYear, getMonth, getDate } from "date-fns";

const API_URL = "http://localhost:8080/api/event/";

class EventService {
    
    async createEvent(title, startDate, endDate, startTime, endTime, userId, days) {
        const start = ((startTime) ? set(startTime, {year: getYear(startDate), month: getMonth(startDate), date: getDate(startDate)}) : startDate).toISOString();
        const end = ((endTime) ? set(endTime, {year: getYear(endDate), month: getMonth(endDate), date: getDate(endDate)}) : endDate).toISOString();
        console.warn("start: ", start, "\nend: ", end)
        const r = (await axios.post(API_URL + userId, { title, start, end, userId, days })).data;
        return r; 
    }
    // ... all the other requests 

    async getEvents(userId) {
        const r = (await axios.get(API_URL + userId)).data;
        return r;
    }
}
export default new EventService();

