var express = require('express')
var json = require('./data.json')
var router = express.Router()

var findBySlug = function (slug) {
  for (var v = 0; v < json.vacancies.length; v++) {
    if (json.vacancies[v].slug === slug) {
      json.vacancies[v].school = json.schools[json.vacancies[v].school_id]
      return json.vacancies[v]
    }
  }
}
// Route middleware
router.use(function (req, res, next) {
  if (req.query.version) {
    req.session.version = req.query.version
  }
  if (req.query.search_results) {
    res.locals.search_results = req.query.search_results
  }
  res.locals.version = req.session.version ? req.session.version : 1
  res.locals.url = process.env.URL
  res.locals.json = json
  next()
})
// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/vacancies/:slug', function (req, res) {
  var vacancy = findBySlug(req.params.slug)
  res.render('vacancies/show', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply', function (req, res) {
  var vacancy = findBySlug(req.params.slug)
  res.render('apply/form', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply/confirm', function (req, res) {
  var vacancy = findBySlug(req.params.slug)
  res.render('apply/confirm', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply/success', function (req, res) {
  var vacancy = findBySlug(req.params.slug)
  res.render('apply/success', {'vacancy': vacancy})
})

module.exports = router
