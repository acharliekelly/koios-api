// TODO: move to Koios

// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express'
import { create } from '../models/token'
require('dotenv').config()

// TODO: create Stripe Key
// configurations for stripe
const keySecret = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(keySecret)

// instantiate a router (mini app that only handles routes)
const router = Router()

router.post('/charge', (req, res, next) => {
  const token = Object.assign(req.body.token)

  create(token)
    .then(token => res.status(201).json({
      token: token.toJSON()
    }))
    .then(() => {
      const token = req.body.token.tokenId
      stripe.charges.create({
        amount: req.body.token.total,
        currency: 'usd',
        description: 'Test Ichigo',
        source: token
      })
    })
    .catch(next)
})

export default router
