const verifyEvent = require('../middlewares/verifyEvent')

const eventController = {
    create: async (req, res) => {
        const {userId} = req.params
        const {title, startDate, endDate, days} = req.body

        //console.warn("controller:\n", "title: ", title, "\nstartDate: ", startDate, "\nendDate: ", endDate, "\nuserID: ", userId)

        const r = await verifyEvent.create(title, startDate, endDate, userId, days)

        return res.status(200).json(r)
    },

    update: async(req, res) => {
        const {userId, eventId} = req.params
        const {edits} = req.body

        const r = await verifyEvent.update(userId, eventId, edits)

        return res.status(200).json(r)
    },
    
    find: async (req, res) => { 
        const {userId} = req.params
        const events = await verifyEvent.find(userId)

        return  res.status(200).json({ events, status: events.length ? 200 : 404 })
    },

    delete: async(req, res) => {
        const {userId, eventId} = req.params
        const status = await verifyEvent.delete(userId, eventId)

        return res.status(200).json({status})
    }
}

module.exports = eventController