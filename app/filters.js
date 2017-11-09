var moment = require('moment')
var pluralize = require('pluralize')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  filters.number = function (number) {
    return number ? number.toLocaleString() : number
  }
  filters.url = function (uri, resource) {
    resource = resource || ''
    if (resource.length) {
      resource = resource + '/'
    }
    var url = process.env.URL ? process.env.URL : ''
    return url + '/' + resource + uri
  }
  filters.date = function (string, format) {
    format = format || 'DD/MM/YYYY'
    return moment(string).format(format)
  }
  filters.filterEmpty = function (arr) {
    return arr.filter(function (n) { return n !== undefined && n.length > 0 })
  }
  filters.stringify = function (obj) {
    return obj ? JSON.stringify(obj) : '';
  }
  filters.slug = function (string) {
    return string.toLowerCase().replace(/[^a-z0-9]/g, '-')
  }
  filters.pluralize = function (string, number) {
    return pluralize(string, number)
  }
  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
