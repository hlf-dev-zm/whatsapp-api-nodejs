/* eslint-disable no-unsafe-optional-chaining */
const { WhatsAppInstance } = require('../class/instance')
const logger = require('pino')()
const config = require('../../config/config')

class Session {
    async restoreSessions(sessions = []) {
        let restoredSessions = new Array()
        let allCollections = sessions
        try {
            const db = mongoClient.db('whatsapp-session')
            const result = await db.listCollections().toArray()
            if (allCollections.length == 0) {
                result.forEach((collection) => {
                    allCollections.push(collection.name)
                })
            } else {
                allCollections = allCollections.filter((collection_name) => {
                    return (
                        result.filter((c) => c.name === collection_name)
                            .length > 0
                    )
                })
            }

            allCollections.map((key) => {
                const query = {}
                db.collection(key)
                    .find(query)
                    .toArray(async (err, result) => {
                        if (err) throw err
                        const webhook = !config.webhookEnabled
                            ? undefined
                            : config.webhookEnabled
                        const webhookUrl = !config.webhookUrl
                            ? undefined
                            : config.webhookUrl
                        const instance = new WhatsAppInstance(
                            key,
                            webhook,
                            webhookUrl
                        )
                        await instance.init()
                        WhatsAppInstances[key] = instance
                    })
                restoredSessions.push(key)
            })
        } catch (e) {
            logger.error('Error restoring sessions')
            logger.error(e)
        }
        return restoredSessions
    }
}

exports.Session = Session
