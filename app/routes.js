var express = require('express')
var _ = require('underscore')
var router = express.Router()
var search = require('./search')
var data = require('./data')

// Route middleware
router.use(function (req, res, next) {
  if (req.query.version) {
    req.session.version = req.query.version
  }
  if (req.query.search_results) {
    res.locals.search_results = req.query.search_results
  }
  if (req.query.show_map) {
    res.locals.show_map = req.query.show_map
  }
  res.locals.version = req.session.version ? req.session.version : 1
  res.locals.url = process.env.URL
  res.locals.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
  res.locals.json = data.getAll()
  res.locals.multiple_checked = function (item, data) {
    if (data && data.indexOf(item) >= 0) {
      return ' checked'
    }
  }
  next()
})
// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/vacancies', function (req, res) {
  var vacancies = data.getAll('vacancies')
  var query = _.chain(req.query).omit('search_results').value()
  var isEmpty = _.chain(query).values().unique().compact().isEmpty().value()
  if (req.query.search_results && !isEmpty) {
    vacancies = search.filter(query)
  }
  res.render('vacancies/index', {'vacancies': vacancies})
})

router.get('/vacancies/:slug', function (req, res) {
  var vacancy = (req.query.preview) ? getPreview(req.session.data) : data.findBySlug(req.params.slug)
  res.render('vacancies/show', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply', function (req, res) {
  var vacancy = data.findBySlug(req.params.slug)
  res.render('apply/form', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply/confirm', function (req, res) {
  var vacancy = data.findBySlug(req.params.slug)
  res.render('apply/confirm', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply/success', function (req, res) {
  var vacancy = data.findBySlug(req.params.slug)
  res.render('apply/success', {'vacancy': vacancy})
})


function getPreview (previewData) {
  var schools = data.getAll('schools')
  return {
    'slug': 'preview',
    'school_id': 'surrey-1',
    'reference_no': 'PREVIEW',
    'title': previewData.title,
    'position': 'Teacher',
    'contract_type': previewData.working_pattern,
    'main_subject': previewData.main_subject,
    'status': 'Published',
    'headline': previewData.headline,
    'salary_min': previewData.salary_min,
    'salary_max': previewData.salary_max,
    'description': previewData.description_wysiwyg,
    'education_requirements': previewData.education,
    'experience_requirements': previewData.essential_requirements,
    'benefits': previewData.benefits,
    'qualifications': previewData.qualifications,
    'experience': previewData.experience,
    'school': schools['surrey-1']
  }
}

module.exports = router
