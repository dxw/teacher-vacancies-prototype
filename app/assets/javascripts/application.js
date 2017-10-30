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

var checkLocation = function () {
  var $location = $('#location')
  if ($location.length && $location.val().length) {
    $('#search-radius').removeAttr('disabled')
    $('#exactly').attr('selected', 'selected')
    $('#nationally').removeAttr('selected')
  } else {
    $('#search-radius').attr('disabled', 'disabled')
    $('#exactly').removeAttr('selected')
    $('#nationally').attr('selected', 'selected')
  }
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

var initMultipleTextInput = function (selector) {
  $(selector).multiTextInput();
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

  initMultipleTextInput('#essential_requirements')
  initMultipleTextInput('#education')
  initMultipleTextInput('#qualifications')
  initMultipleTextInput('#experience')

  $('#close-notification').on('click', function () {
    $(this).parents('.notification').hide()
  })

  checkLocation()
  $('#location').on('keyup', function () {
    checkLocation()
  })
})
