// iframe uploader
// ===============
//

define("arale/iframe-uploader/0.9.1/iframe-uploader-debug", ["gallery/jquery/1.7.2/jquery-debug"], function(require, exports, module) {
    var $ = require('gallery/jquery/1.7.2/jquery-debug');

    function IframeUploader(options) {
        if (!(this instanceof IframeUploader)) {
            return new IframeUploader(options);
        }
        if (isString(options)) options = {trigger: options};

        var settings = {
            trigger: null,
            name: null,
            action: null,
            data: null,
            accept: null,
            change: null,
            error: null,
            success: null
        };
        if (options) {
            $.extend(settings, options);
        }
        var $trigger = $(settings.trigger);

        settings.action = settings.action || $trigger.data('action') ||
            '/upload';
        settings.name = settings.name || $trigger.data('name') || 'file';
        settings.data = settings.data || parse($trigger.data('data'));
        settings.accept = settings.accept || $trigger.data('accept');
        settings.success = settings.success || $trigger.data('success');
        this.settings = settings;

        this.setup();
        this.bind();
    }

    // initialize
    // create input, form, iframe
    IframeUploader.prototype.setup = function() {
        var iframeName = 'iframe-uploader-' + new Date().getTime();
        this.iframe = $('<iframe name="' + iframeName + '" />').hide();

        this.form = $('<form method="post" enctype="multipart/form-data"'
                      + 'target="' + iframeName + '" '
                      + 'action="' + this.settings.action + '" />');

        this.form.append(createInputs(this.settings.data));

        var input = document.createElement('input');
        input.type = 'file'; input.name = this.settings.name;
        if (this.settings.accept) input.accept = this.settings.accept;
        this.input = $(input);

        var $trigger = $(this.settings.trigger);
        this.input.attr('hidefocus', true).css({
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0,
            outline: 0,
            cursor: 'pointer',
            height: $trigger.outerHeight(),
            fontSize: Math.max(64, $trigger.outerHeight() * 5)
        });
        this.form.append(this.input);
        this.form.css({
            position: 'absolute',
            top: $trigger.offset().top,
            left: $trigger.offset().left,
            overflow: 'hidden',
            width: $trigger.outerWidth(),
            height: $trigger.outerHeight(),
            zIndex: findzIndex($trigger) + 10
        }).appendTo('body');

        return this;
    };

    // bind events
    IframeUploader.prototype.bind = function() {
        var self = this;
        var $trigger = $(self.settings.trigger);
        $trigger.mouseenter(function() {
            self.form.css({
              top: $trigger.offset().top,
              left: $trigger.offset().left,
              width: $trigger.outerWidth(),
              height: $trigger.outerHeight()
            })
        });
        self.input.change(function() {
            var file = self.input.val();
            if (self.settings.change) {
              if (file) file = file.substr(file.lastIndexOf('\\') + 1);
              self.settings.change(file);
            } else if (file) {
              return self.submit();
            }
        });
    };

    // handle submit event
    // prepare for submiting form
    IframeUploader.prototype.submit = function() {
        var self = this;
        $('body').append(self.iframe);
        self.iframe.on('load', function() {
            var response = self.iframe.contents().find('body').html();
            self.iframe.off('load').remove();
            if (!response) {
                if (self.settings.error) self.settings.error(self.input.val());
            } else {
                if (self.settings.success) self.settings.success(response);
            }
        });
        self.form.submit();
        return this;
    };

    // handle change event
    // when value in file input changed
    IframeUploader.prototype.change = function(callback) {
        if (!callback) return this;
        this.settings.change = callback;
        return this;
    };

    // handle when upload success
    IframeUploader.prototype.success = function(callback) {
        if (!callback) return this;
        this.settings.success = callback;
        return this;
    };

    // handle when upload success
    IframeUploader.prototype.error = function(callback) {
        if (!callback) return this;
        this.settings.error = callback;
        return this;
    };

    // Helpers
    // -------------

    function isString(val) {
        return Object.prototype.toString.call(val) === '[object String]';
    }

    function createInputs(data) {
        if (!data) return [];

        var inputs = [], i;
        for (var name in data) {
            i = document.createElement('input');
            i.type = 'hidden';
            i.name = name;
            i.value = data[name];
            inputs.push(i);
        }
        return inputs;
    }

    function parse(str) {
        if (!str) return {};
        var ret = {};

        var pairs = str.split('&');
        var unescape = function(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        };

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = unescape(pair[0]);
            var val = unescape(pair[1]);
            ret[key] = val;
        }

        return ret;
    }

    function findzIndex($node) {
        var parents = $node.parentsUntil('body');
        var zIndex = 0;
        for (var i = 0; i < parents.length; i++) {
            var item = parents.eq(i);
            if (item.css('position') !== 'static') {
                zIndex = parseInt(item.css('zIndex'), 10) || zIndex;
            }
        }
        return zIndex;
    }

    module.exports = IframeUploader;
});
