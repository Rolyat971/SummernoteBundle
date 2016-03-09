(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  /**
   * PasteWord
   */
  var PasteWord = (function () {

    /**
     * formatInput removes all MS Word formatting
     *
     * Original source/author:
     * http://patisserie.keensoftware.com/en/pages/remove-word-formatting-from-rich-text-editor-with-javascript
     *
     * @param {String} sInput
     * @return {String} Reformatted input
     */
    var formatInput = function (sInput) {

      // 1. remove line breaks / Mso classes
      var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
      var output = sInput.replace(stringStripper, ' ');

      // 2. strip Word generated HTML comments
      var commentSripper = new RegExp('<!--(.*?)-->', 'g');
      output = output.replace(commentSripper, '');

      // 3. remove tags leave content if any
      var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
      output = output.replace(tagStripper, '');

      // 4. Remove everything in between and including tags '<style(.)style(.)>'
      var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

      for (var i = 0; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
      }

      // 5. remove attributes ' style="..."'
      var badAttributes = ['style', 'start'];
      for (var ii = 0; ii < badAttributes.length; ii++) {
        var attributeStripper = new RegExp(' ' + badAttributes[ii] + '="(.*?)"', 'gi');
        output = output.replace(attributeStripper, '');
      }

      return output;
    };

    return {
      format: formatInput
    };
  })();

  // template
  var tmpl = $.summernote.renderer.getTemplate();

  var showPasteWordDialog = function (editable, dialog) {
    return $.Deferred(function (deferred) {
      var pasteWordDialog = dialog.find('.note-pasteword-dialog');
      var pasteWordText = pasteWordDialog.find('.note-pasteword-text');
      var pasteWordBtn = pasteWordDialog.find('.note-pasteword-btn');

      pasteWordDialog.one('shown.bs.modal', function () {
        pasteWordText.keyup(function () {
          toggleBtn(pasteWordBtn, pasteWordText.val());
        }).trigger('focus').trigger('select');

        pasteWordBtn.one('click', function (event) {
          event.preventDefault();

          deferred.resolve(pasteWordText.val());
          pasteWordDialog.modal('hide');
          pasteWordText.val('');
        });
      }).one('hidden.bs.modal', function () {
        pasteWordText.off('keyup');

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      }).modal('show');
    }).promise();
  };

  /**
   * toggle button status
   *
   * @member plugin.video
   * @private
   * @param {jQuery} $btn
   * @param {Boolean} isEnable
   */
  var toggleBtn = function ($btn, isEnable) {
    $btn.toggleClass('disabled', !isEnable);
    $btn.attr('disabled', !isEnable);
  };

  $.summernote.addPlugin({
    name: 'pasteWord',
    buttons: {
      pasteWord: function (lang, options) {
        return tmpl.iconButton('fa fa-clipboard icon-clipboard', {
          event: 'showPasteWordDialog',
          title: lang.pasteWord.insert
        });
      }
    },
    events: {
      showPasteWordDialog: function (event, editor, layoutInfo) {
        var dialog = layoutInfo.dialog(),
          editable = layoutInfo.editable();

        editor.saveRange(editable);
        showPasteWordDialog(editable, dialog).then(function (sPasteWordText) {
          editor.restoreRange(editable);
          editable.data('NoteHistory').recordUndo(editable);
          sPasteWordText = PasteWord.format(sPasteWordText);
          editor.insertText(editable, sPasteWordText);
        }).fail(function () {
          editor.restoreRange(editable);
        });
      }
    },
    dialogs: {
      showPasteWordDialog: function (lang) {
        var body = '<div class="form-group">' +
                     '<label>' + lang.pasteWord.description + '</label>' +
                     '<textarea class="note-pasteword-text form-control span12"></textarea>' +
                   '</div>';
        var footer = '<button href="#" class="btn btn-primary note-pasteword-btn disabled" disabled>' + lang.pasteWord.insert + '</button>';
        return tmpl.dialog('note-pasteword-dialog', lang.pasteWord.insert, body, footer);
      }
    },
    langs: {
      'en-US': {
        pasteWord: {
          insert: 'Paste from Word',
          description: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window. Please paste inside the following box using the keyboard (Ctrl/Cmd+V).'
        }
      }
    }
  });
}));
