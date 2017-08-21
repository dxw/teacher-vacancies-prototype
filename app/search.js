var elasticlunr = require('elasticlunr')
var data = require('./data')
var config = require('./search.config.json')
var _ = require('underscore')

var stopWords = ['school', 'teacher']
elasticlunr.addStopWords(stopWords)

var search = {}
search.index = elasticlunr(function () {
  this.setRef('slug')
  for (var item in config.fields) {
    this.addField(item)
  }
  var json = data.getAll()
  json.vacancies.forEach(function (doc) {
    doc.salary_range = '£' + doc.salary_min.toLocaleString() + ' - ' + '£' + doc.salary_max.toLocaleString()
    doc.school = _.values(json.schools[doc.school_id]).join(' ')
    this.addDoc(doc)
  }, this)
})

search.filter = function (params) {
  return search.index.search(_.values(params).join(' '), config)
    .map(function (result) {
      var vacancy = data.findBySlug(result.ref)
      vacancy.score = result.score
      return vacancy
    })
}

module.exports = search
