/*!
* jQuery Multiple text input plugin
*
*/
;(function($) {
  $.multiTextInput = function(el, options) {
    var base = this;
    base.$el = $(el);
    base.el = el;
    base.name = base.$el.attr('name');
    base.id = base.$el.attr('id');
    base.inputs = [];

    base.$el.data('multiTextInput', base);

    base.init = function () {
      base.options = $.extend({}, $.multiTextInput.defaultOptions, options);
      base.addMaster();
      base.inputs.push(base.$el);
      base.value = base.$el.data('value') ? base.$el.data('value') : [];
      var min = base.options.min > 0 ? base.options.min : 1;
      min = min > base.value.length ? min : base.value.length + 1;
      for (var a = 1; a < min - 1; a++) {
        base.clone(el);
      }
      base.load();
      base.duplicate(base.el);
      base.options.init(base.el);
    };
    base.load = function () {
      $.each(base.getInputs(), function (k, el) {
        if (base.value[k]) {
          $(el).val(base.value[k].toString());
        }
      });
    }
    base.clone = function (el) {
      var $clone = $(el).clone()
      $clone.appendTo(base.$el.parent()).bind('blur', function () {
        var index = base.$el.parent().find('input:visible').index($(this));
        if (this.value === '' && index < base.getInputs().length - 2) {
          base.remove($(this));
        }
        base.updateMaster();
      });
      base.inputs.push($clone);
      return $clone;
    }
    base.addMaster = function () {
      base.$master = $('<input>');
      base.$master.attr('id', base.id).attr('type', 'hidden');
      base.$el.parent().prepend(base.$master);
    }
    base.getValues = function () {
      var values = []
      $.each(base.getInputs(), function (k, el) {
        values.push($(el).val());
      });
      return values;
    }
    base.updateMaster = function () {
      base.$master.attr('data-value', JSON.stringify(base.getValues()));
    }
    base.duplicate = function (e) {
      var n = base.getInputs().length
      var $el = $(e)
      if (n >= base.options.max || (n > 1 && $el.prev().val() === '')) {
        return
      }
      $el.unbind('focus');
      base.clone(e).bind('focus', function () {
        base.duplicate(this);
      }).val('');
      base.shuffleNames();
    }
    base.shuffleNames = function () {
      var els = base.getInputs()
      $.each(els, function (k, el) {
        $(el).attr('name', base.name + '[' + k + ']');
        $(el).attr('id', base.name + '_' + k);
      })
    }
    base.remove = function (el) {
      for (var i = 0; i < base.inputs.length; i++) {
        if (base.inputs[i].attr('name') === el.attr('name')) {
          base.inputs.splice(i, 1);
          $(el).remove();
          base.shuffleNames();
        }
      }

    }
    base.getInputs = function () {
      return base.inputs;
    }
    base.init();
  };

  $.multiTextInput.defaultOptions = {
    'min': 2,
    'max': 500,
    'init': function(el){}
  };

  $.fn.multiTextInput = function(options) {
    return this.each(function () {
      new $.multiTextInput(this, options);
    });
  };
  //onmax
  //val override

})(jQuery);
