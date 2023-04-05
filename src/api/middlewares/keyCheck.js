const { Session } = require('../class/session')

async function keyVerification(req, res, next) {
    const key = req.query['key']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no key query was present' })
    }
    const instance = WhatsAppInstances[key]
    if (!instance) {
        const session = new Session()
        let restoredSessions = await session.restoreSessions([key])
        if (restoredSessions.length == 0) {
            return res
                .status(403)
                .send({ error: true, message: 'invalid key supplied' })
        }
    }
    next()
}

module.exports = keyVerification
