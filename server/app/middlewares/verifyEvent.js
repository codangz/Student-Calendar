const Event = require('../models/events.model');

const eventService = {
    create: async (title, startDate, endDate, creator, days) => {

        //console.log("verify:\n", "title: ", title, "\nstartDate: ", startDate, "\nendDate: ", endDate)

        // error if event is shorter than 5 min 
        if(new Date(endDate) - new Date(startDate) < 5*60*1000) {
            return {
                event: null, 
                status: 400,
                message: 'Event must be longer than 5 minutes.',
                overlaps: []
            }
        }

        // check conflicts for classes  
        //... 
        
        // check conflicts for single day events 
        const overlaps = await Event.find({
            creator,

            $or: [ 
                // starts at the same time or in the middle of an already existing event
                { 
                    $and: [ 
                        { startDate: { $gte: startDate } },
                        { startDate: { $lt: endDate } }
                    ] 
                },

                // ends at the same time or in the middle of an already existing event
                { 
                    $and: [ 
                        { endDate: { $gt: startDate } },
                        { endDate: { $lte: endDate } }
                    ] 
                },

                // starts before and already existing event but ends after it
                { 
                    $and: [ 
                        { startDate: { $lte: startDate } },
                        { endDate: { $gte: endDate } }
                    ] 
                }
            ]
        }, 'title startDate endDate')

        if(overlaps.length) {
            return {
                event: null,
                status: 409,
                message: 'Event overlaps with existing event(s).',
                overlaps
            }
        }

        const returnVal = {};

        try {
            console.warn(title, typeof startDate, typeof endDate);
            returnVal.event = await Event.create({ title, startDate, endDate, creator, days });
            returnVal.status = 200;
        }
        catch(e) {
            returnVal.event = null;
            returnVal.status = 400;
            returnVal.message = 'Error';
            returnVal.overlaps = overlaps;

            console.log(e);
        }
        return returnVal;
    },

    update: async(userId, eventId, edits) => {
        const oldEvent = await Event.findById(eventId);
        
        // if event less than 5 min --> invalid 
        if(
            (edits.startDate || edits.endDate) &&
            (
                new Date(edits.endDate || oldEvent.endDate) - new Date(edits.startDate || oldEvent.startDate) < 5*60*1000
            )
        ){
            return {
                event: null,
                status: 400,
                message: 'Event must be longer than 5 minutes.', 
                overlaps: [] 
            }
        }

        const overlaps = !(edits.startDate || edits.endDate) ? [] : await Event.find({
            
            creator: userId, 
            
            _id: { $ne: eventId },

            $or: [ 
                { 
                    $and: [ 
                        { startDate: { $gte: edits.startDate || oldEvent.startDate } },
                        { startDate: { $lt: edits.endDate || oldEvent.endDate } }
                    ] 
                },
                { 
                    $and: [ 
                        { endDate: { $gt: edits.startDate || oldEvent.startDate } },
                        { endDate: { $lte: edits.endDate || oldEvent.endDate } }
                    ] 
                },
                { 
                    $and: [ 
                        { startDate: { $lte: edits.startDate || oldEvent.startDate } },
                        { endDate: { $gte: edits.endDate || oldEvent.endDate } }
                    ] 
                }
            ]
        }, 'title startDate endDate')
        
        const returnVal = {};

        if(overlaps.length){
            returnVal.event = null;
            returnVal.status = 409;
            returnVal.message = 'Overlap with other event(s).'; 
            returnVal.overlaps = overlaps;
        }

        else{

            const updates = { 
                set: {}
            }

            if(edits.title){ updates.set.title = edits.title; }
            if(edits.startDate){ updates.set.startDate = edits.startDate; }
            if(edits.endDate){ updates.set.endDate = edits.endDate; }
            if(edits.days){ updates.set.days = edits.days; }

            try {
                const targetEvent = await Event.findById(eventId)

                if(targetEvent){
                    returnVal.event = await Event.findByIdAndUpdate(eventId, {
                        $set: { ...updates.set }

                    }, { new: true })
                    
                    returnVal.status = 200;
                }
                
                else{
                    returnVal.event = null
                    returnVal.status = 404,
                    returnVal.message = 'Unfortunately, this event was not found.' 
                }
            } 

            catch(e){
                returnVal.newEvent = null;
                returnVal.status = 400;
                returnVal.message = 'An error ocurred.';
                returnVal.overlaps = overlaps;

                console.log(e)
            }
        }

        return returnVal
    },


    find: async (userId) => await Event.find({creator: userId}),

    delete: async(userId, eventId) => {
        try {
            await Event.findOneAndDelete({ _id: eventId, creator: userId })
            return 200
        } 

        catch(e){ return 400 }
    }
}

module.exports = eventService