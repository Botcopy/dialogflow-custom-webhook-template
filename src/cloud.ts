const functions = require('firebase-functions')
const app = require('./app')

exports.app = functions.https.onRequest(app)