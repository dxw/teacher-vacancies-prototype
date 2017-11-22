var elasticlunr = require('elasticlunr')
var data = require('./data')
var config = require('./search.config.json')
var _ = require('underscore')

var stopWords = ['school', 'teacher', 'time']
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

function search_index(vacancies) {

  return elasticlunr(function () {
    this.setRef('slug')
    for (var item in config.fields) {
      this.addField(item)
    }
    var json = data.getAll()
    vacancies.forEach(function (doc) {
      doc.salary_range = '£' + doc.salary_min.toLocaleString() + ' - ' + '£' + doc.salary_max.toLocaleString()
      doc.school = _.values(json.schools[doc.school_id]).join(' ')
      this.addDoc(doc)
    }, this)
  })
}


function search_filter(vacancies, search_term) {

  if (search_term) {

    vacancies = search_index(vacancies).search(search_term)
    .map(function (result) {
      var vacancy = data.findBySlug(result.ref)
      vacancy.score = result.score
      return vacancy
    })
  }

  return vacancies
}


function single_choice_filter(vacancies, filter, property) {

  if (filter) {

    vacancies = vacancies.filter(function(vacancy) {
      return vacancy[property]
    })

  }

  return vacancies

}

function multiple_choices_filter(vacancies, filter, property) {

  if (filter && filter.length > 0) {
    vacancies = vacancies.filter(function(vacancy) {

      if (Array.isArray(vacancy[property])) {
        return (vacancy[property] || []).find(function(property) {
          return filter.indexOf(property) >= 0
        })
      } else {

        return filter.indexOf(vacancy[property]) >= 0

      }
    })
  }

  return vacancies

}

function salary_range_filter(vacancies, filter) {

  if (filter && filter.length > 0) {

    var salary_ranges_filters = filter.map(function(salary_range) {

      var split = salary_range.split('-')
      var min = parseInt(split[0])
      var max = parseInt(split[1])

      return {'min': min, 'max': max};
    })

    vacancies = vacancies.filter(function(vacancy) {

      salary_range_matches = salary_ranges_filters.filter(function(salary_range) {

        return (vacancy.salary_min <= salary_range.max && salary_range.min <= vacancy.salary_max);
      })

      return (salary_range_matches.length > 0)

    })
  }

  return vacancies

}

search.new_filter = function(filters) {


  var vacancies = data.getAll().vacancies

  vacancies = vacancies.filter(function(vacancy) {
    return vacancy.status == 'Published';
  })

  vacancies = search_filter(vacancies, filters.keyword)
  vacancies = salary_range_filter(vacancies, filters.salary_ranges)
  vacancies = single_choice_filter(vacancies, filters.suitable_for_nqt, 'suitable_for_nqt')
  vacancies = single_choice_filter(vacancies, filters.job_share_available, 'job_share_available')
  vacancies = multiple_choices_filter(vacancies, filters.working_patterns, 'contract_type')
  vacancies = multiple_choices_filter(vacancies, filters.key_stages, 'key_stages')
  vacancies = multiple_choices_filter(vacancies, filters.leadership_levels, 'leadership_level')

  return vacancies
}

module.exports = search
