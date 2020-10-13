// TODO: move to Koios

// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express'
// pull in Mongoose model for examples
import Purchase from '../models/purchase'

// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const requireToken = authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = Router()

// INDEX
router.get('/purchases', requireToken, (req, res, next) => {
  Purchase.find({ closed: true, owner: req.user.id })
    .populate('items')
    .then(purchases => {
      // `purchases will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one

      return purchases.map(purchase => purchase.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(purchases => res.status(200).json({ purchases }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

export default router
