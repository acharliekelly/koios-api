// TODO: move to Koios

// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express'

// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'

// pull in Mongoose model for purchases
import Purchase from '../models/purchase';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404, requireOwnership } from '../../lib/custom_errors'

const requireToken = authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = Router()

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/cart', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Purchase.findOne({ closed: false, owner: req.user.id })
    .populate('items')
    .exec(function (err, product) {
      if (err) throw err
      return product
    })
    .then(cart => res.status(200).json({ cart: cart.toObject() }))

    // if an error occurs, pass it to the handler
    .catch(() => {
      req.body.purchase = {}
      req.body.purchase.owner = req.user.id
      Purchase.create(req.body.purchase, function (err, cart) {
        if (err) console.log(err)
        return cart
      })

        .then(cart => {
          return cart
        })
      // respond to succesful `create` with status 201 and JSON of new "cart"
        // but logs type of this item as undefined
        .then(cart => {
          res.status(201).json({ cart: cart.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
    })
})

// CREATE
router.post('/cart', requireToken, (req, res, next) => {
  console.log(req.body)
  console.log(req.body.purchase)
  req.body.purchase.owner = req.user.id
  console.log(req.body.purchase)
  Purchase.create(req.body.purchase, function (err, cart) {
    if (err) console.log(err)
    return cart
  })

    .then(cart => {
      return cart
    })
  // respond to succesful `create` with status 201 and JSON of new "cart"
    // but logs type of this item as undefined
    .then(cart => {
      res.status(201).json({ cart: cart.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /cart
router.patch('/add-item/:id', requireToken, (req, res, next) => {
  // add item to cart

  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  // delete req.body.purchase.owner

  Purchase.findOne({ closed: false, owner: req.user.id })
    .then(handle404)
    .then(cart => {
      requireOwnership(req, cart)
      cart.items.nonAtomicPush(req.params.id)
      console.log(cart)
      cart.save(function (err) {
        if (err) {
          console.log(err)
        }
      })
      return cart
    })
    // if that succeeded, return 201 and updated item as json
    .then(cart => {
      res.status(201).json({ cart: cart.toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DELETE
// DELETE item from cart
router.delete('/remove-item/:id', requireToken, (req, res, next) => {
  Purchase.findOne({ closed: false, owner: req.user.id })
    .then(handle404)
    .then(cart => {
      cart.items.pull(req.params.id)
      console.log(cart)
      cart.save()
      return cart
    })
    // if that succeeded, return 201 and updated item as json
    .then(cart => {
      res.status(201).json({ cart: cart.toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// UPDATE closed status to true
router.patch('/checkout', requireToken, (req, res, next) => {
  Purchase.findOne({ closed: false, owner: req.user.id })
    .then(handle404)
    .then(cart => {
      return cart.update({ closed: true })
    })
    .then(() => {
      req.body.purchase = {}
      req.body.purchase.owner = req.user.id
      Purchase.create(req.body.purchase, function (err, cart) {
        if (err) console.log(err)
        return cart
      })

        .then(cart => {
          return cart
        })
      // respond to succesful `create` with status 201 and JSON of new "cart"
        // but logs type of this item as undefined
        .then(cart => {
          res.status(201).json({ cart: cart.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

export default router
