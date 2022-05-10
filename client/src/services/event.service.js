// These are the routes from events.routes.js--create a request for each backend response
// app.get('/api/event/:userId', eventController.find);
// app.post('/api/event/:userId', eventController.create);
// app.put('/api/event/:userId/:eventId', eventController.update);
// app.delete('/api/event/:userId/:eventId', eventController.delete);

import axios from "axios";

const API_URL = "http://localhost:8080/api/event/";

class EventService {

    createEvent(title, startDate, endDate, startTime, endTime, userId, days) {
        const start = startDate.setTime(startTime.getTime());
        const end = endDate.setTime(endTime.getTime());
        const r = (await axios.get(API_URL + userId, { title, start, end, days })).data;
        return r; 
    }
    // ... all the other requests 
}
export default EventService;

