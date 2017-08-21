var json = require('./data.json')
var data = {}

data.findBySlug = function (slug) {
  for (var v = 0; v < json.vacancies.length; v++) {
    if (json.vacancies[v].slug === slug) {
      json.vacancies[v].school = json.schools[json.vacancies[v].school_id]
      return json.vacancies[v]
    }
  }
}

data.getAll = function (type) {
  if (type) {
    return json[type]
  }
  return json
}

module.exports = data
