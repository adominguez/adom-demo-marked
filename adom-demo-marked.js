(function () {
  'use strict';

  Polymer({

    is: 'adom-demo-marked',

    properties: {
      _markdown: {
        type: String,
        value: '',
        observer: '_markChange'
      },
      _contentIframe: {
        type: String,
        value: ''
      },
      width: {
        type: Number,
        value: 1024
      },
      height: {
        type: Number,
        value: 790
      },
      padding: {
        type: Number,
        value: 0
      },
      componentName: {
        type: String,
        value: null
      }
    },

    _markChange: function () {
      var template = Polymer.dom(this).queryDistributedElements('template')[0];
      var html;

      // If there's no template, render empty code.
      if (!template) {
        this._markdown = '```\n```';
        return;
      }

      var snippet = this.$.marked.unindent(template.innerHTML);

      var that = this;


      document.addEventListener('set-properties', function(event) {
        that.width = event.detail.width;
        that.height = event.detail.height;
        if((that.width === null) && (that.height === null)) {
          that.$.iframe.classList.remove('border');
          that.$.iframe.classList.add('fullwidth');
        } else {
          that.$.iframe.classList.remove('fullwidth');
          that.$.iframe.classList.add('border');
        };
        that.componentName = event.detail.component;
      })

      // Boolean properties are displayed as checked="", so remove the ="" bit.
      snippet = snippet.replace(/=""/g, '');

      html = `<!doctype html>
      <html lang="en">

      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">

        <title>${this.componentName} demo</title>

        <script src="../../webcomponentsjs/webcomponents-lite.js"></script>
        <script>
          window.Polymer = {
            dom: 'shadow',
            lazyRegister: 'true',
            useNativeCSSProperties: 'true'
          }
        </script>

        <link rel="import" href="../../adom-demo-marked/adom-demo-marked.html">
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic" crossorigin="anonymous">
        <link rel="import" href="../${this.componentName}.html">

        <style is="custom-style" include="demo-pages-shared-styles">
          /*Common styles*/
          body {
            font-family: Roboto;
            margin: 0;
            background-color: #fff;
            padding: ${this.padding}px;
            box-sizing: border-box;
          }
        </style>
      </head>

      <body>
        ${snippet}
      </body>

      </html>
      `

      this._contentIframe = html;

      this._markdown = '```\n' + snippet + '\n' + '```';

      // Stamp the template.
      if (!template.hasAttribute('is')) {
        Polymer.dom(this).appendChild(document.importNode(template.content, true));
      }

    },

    _copyToClipboard: function () {
      // From https://github.com/google/material-design-lite/blob/master/docs/_assets/snippets.js
      var snipRange = document.createRange();
      snipRange.selectNodeContents(this.$.code);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(snipRange);
      var result = false;
      try {
        result = document.execCommand('copy');
        this.$.copyButton.icon = 'done';
      } catch (err) {
        // Copy command is not available
        Polymer.Base._error(err);
        this.$.copyButton.icon = 'error';
      }

      // Return to the copy button after a second.
      setTimeout(this._resetCopyButtonState.bind(this), 1000);

      selection.removeAllRanges();
      return result;
    },
    _resetCopyButtonState: function () {
      this.$.copyButton.icon = 'content-copy';
    }

  });
}());
