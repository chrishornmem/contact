
const logger = require('debug-level')('contact')
const express = require('express')
const api = express.Router()
const mongoose = require('mongoose')

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const ContactSchema = require('../models/Model').ContactSchema
const Contact = mongoose.model('contacts', ContactSchema)
const jwt = require('jwt-simple')

const TEMPLATES_PATH = './src/app_api/templates/'

const templates = {
    LANDING_FORM : `${TEMPLATES_PATH}contactLanding.pug`,
    CONFIRM_MENU : `${TEMPLATES_PATH}confirmMenu.pug`
}

/*
 * Middleware to grab user
 */
function getUser(req, res, next) {
    if (!req.header('Authorization')) {
        logger.error("missing header")
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    const token = req.header('Authorization').split(' ')[1]
    const payload = jwt.decode(token, process.env.TOKEN_SECRET)

    if (!payload) {
        return res.status(401).send({ message: 'Unauthorized Request' })
    }
    req.user = payload.sub
    next()
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/*
 * Routes
 */
// Landing menu
api.get('/', getUser, async function (req, res) {
    // const data = await landingMenuData(req.user)
    let rootTag = loadTemplate(templates.LANDING_FORM)
    let response = Response.fromTag(rootTag)
    res.json(response.toJSON())
})

api.post('/contactAdd', getUser, function (req, res) {
    logger.info("/contactAdd")
    logger.info("body:")
    logger.info(req.body)
    let contact = new Contact()
    contact.user = req.user
    contact.fullName = capitalize(req.body.fullName)
    contact.email = req.body.email
    contact.interest = req.body.interest.toString()
    contact.message = req.body.message

    contact.save(async function (err, contact) {
        if (err) {
            logger.error(err)
        }
        let rootTag = loadTemplate(templates.CONFIRM_MENU)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    })
})

module.exports = api
