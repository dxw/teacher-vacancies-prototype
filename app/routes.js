var express = require('express')
var _ = require('underscore')
var router = express.Router()
var search = require('./search')
var data = require('./data')
var pjax = require('express-pjax-middleware')

router.use(pjax())

// Route middleware
router.use(function (req, res, next) {
  if (req.query.version) {
    req.session.version = req.query.version
  }
  if (req.query.search_results) {
    res.locals.search_results = req.query.search_results
  }
  if (req.body.redirect_to) {
    return res.redirect('/' + req.body.redirect_to)
  }
  res.locals.query = req.query
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
  var baseUrl = '' + req.protocol + '://' + req.get('host');
  res.render('vacancies/index', {'vacancies': vacancies, url: baseUrl})
})

router.get('/clear-search-data', function (req, res) {
  var filters = [
    'location',
    'keyword',
    'salary_ranges',
    'suitable_for_nqt',
    'job_share_available',
    'working_patterns',
    'key_stages',
    'leadership_levels',
    'search_radius_type',
    'search-radius-distance',
    'search-radius-time'
  ]
  for (var filter in filters) {
    req.session.data[filters[filter]] = null
  }
  res.redirect('/vacancies')
})

router.get('/vacancies/:slug', function (req, res) {
  var vacancy = (req.query.preview) ? getPreview(req.session.data) : data.findBySlug(req.params.slug)
  res.render('vacancies/show', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/apply', function (req, res) {
  var vacancy = data.findBySlug(req.params.slug)
  res.render('apply/form', {'vacancy': vacancy})
})

router.get('/vacancies/:slug/download', function (req, res) {
  var vacancy = data.findBySlug(req.params.slug)
  res.render('vacancies/download', {'vacancy': vacancy})
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
    'school': schools['surrey-1'],
    'application_method': previewData.application_method === 'Application pack' ? 'application_pack' : 'external_link'
  }
}

module.exports = router
