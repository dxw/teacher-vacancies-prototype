/* global $ */
/* global GOVUK */
/* global autosize */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

var checkWorkingPattern = function () {
  if ($('#working_pattern').val() === 'Part time') {
    $('#fte-panel').removeClass('js-hidden')
  } else {
    $('#fte-panel').addClass('js-hidden').find('input').val('')
  }
}

var checkPermanent = function () {
  if ($('#is_permanent').prop('checked')) {
    $('#end-date-panel').addClass('js-hidden').find('input').val('')
  } else {
    $('#end-date-panel').removeClass('js-hidden')
  }
}

var checkFlexible = function () {
  if ($('#working_pattern').val() === 'Flexible') {
    $('#flexible-panel').removeClass('js-hidden')
  } else {
    $('#flexible-panel').addClass('js-hidden').find('input').val('')
  }
}

var checkPublishToday = function () {
  if ($('#publish_today').prop('checked')) {
    $('#posted_at-panel').addClass('js-hidden').find('input').val('')
  } else {
    $('#posted_at-panel').removeClass('js-hidden')
  }
}
var checkSearchRadius = function ($el) {
  if ($el.val() === 'Distance') {
    $('#search-radius-distance').show()
    $('#search-radius-time').hide()
  } else {
    $('#search-radius-distance').hide()
    $('#search-radius-time').show()
  }
}
var checkLocation = function () {
  var $location = $('#location')
  if ($location.length && $location.val().length) {
    $('.search-radius').removeAttr('disabled')
    $('.exactly').attr('selected', 'selected')
    $('.nationally').removeAttr('selected')
  } else {
    $('.search-radius').attr('disabled', 'disabled')
    $('.exactly').removeAttr('selected')
    $('.nationally').attr('selected', 'selected')
  }
  checkSearchRadius($('input[name=search_radius_type]'))
}

var initWordCounter = function (selector, maxWords) {
  $(selector).textcounter({
    type: 'word',
    max: maxWords,
    countDown: true,
    countDownText: '%d words remaining',
    stopInputAtMaximum: false,
    counterErrorClass: 'error-message',
    inputErrorClass: 'form-control-error',
    countContainerClass: 'margin-top-half font-xsmall',
    countOverflow: true,
    displayErrorText: false
  })
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  checkWorkingPattern()
  checkFlexible()
  $('#working_pattern').on('change', function () {
    checkWorkingPattern()
    checkFlexible()
  })

  checkPermanent()
  $('#is_permanent').on('change', function () {
    checkPermanent()
  })

  checkPublishToday()
  $('#publish_today').on('change', function () {
    checkPublishToday()
  })

  autosize($('textarea'))

  initWordCounter('#description', 500)

  $('#close-notification').on('click', function () {
    $(this).parents('.notification').hide()
  })

  checkLocation()
  $('#location').on('input', function () {
    checkLocation()
  })

  $('input[name=search_radius_type]').on('change', function () {
    checkSearchRadius($(this))
  })

  if ($('#description_wysiwyg').length) {
    tinymce.init({
      selector: '#description_wysiwyg',
      valid_elements: 'a[href|target=_blank],strong/b,div[align],br,ul,ol,li,p',
      branding: false,
      menubar: false,
      theme: 'inlite',
      plugins: 'link paste contextmenu textpattern autolink wordcount',
      insert_toolbar: false,
      selection_toolbar: 'quicklink',
      inline: true,
      paste_data_images: false,
      setup: function (editor) {
        editor.on('keyup', function (evt) {
          var wordCount = editor.plugins.wordcount.getCount()
          var remaining = 500 - wordCount
          $('#description_wordcount').text(remaining + ' words remaining')
        })
      }
    })
  }

  if ($('.show-map-toggle.show-map').length != 1) {
    initMap();
  }

  $('.show-map-toggle').on('click', function(event) {

    var target = event.currentTarget;
    var showMap = target.classList.contains('show-map')

    if(showMap) {
      target.classList.remove('show-map');
      $('.map').removeClass('hidden');
      $('.vacancies').addClass('hidden')
      $('.fa').removeClass('fa-map-marker').addClass('fa-list');
      $('.label').text('View results as list')
      $('input[name=show_map]').val(1)
      initMap();
    } else {
      target.classList.add('show-map');
      $('.map').addClass('hidden');
      $('.vacancies').removeClass('hidden')
      $('.fa').removeClass('fa-list').addClass('fa-map-marker');
      $('.label').text('View results on map')
      $('input[name=show_map]').val(0)
    }
    event.preventDefault();
  })
})
