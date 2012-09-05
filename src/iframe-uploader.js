// iframe uploader
// ===============
//

define(function(require, exports, module) {
    var global = this;  // window

    var $ = global.jQuery || require('jquery');

    function IframeUploader(options) {
        if (!(this instanceof IframeUploader)) {
            return new IframeUploader(options);
        }

        var settings = {
            'trigger': null,
            'name': null,
            'action': null,
            'data': null,
            'accept': null,
            'change': null,
            'error': null,
            'success': null
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
        var now = new Date().getTime();
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none'; iframe.href = '#';
        iframe.name = 'iframe-uploader-' + now;
        this.iframe = iframe;

        var form = document.createElement('form');
        form.method = 'post'; form.enctype = 'multipart/form-data';
        // IE use encoding
        form.encoding = 'multipart/form-data';
        form.target = iframe.name; form.action = this.settings.action;

        var inputs = createInputs(this.settings.data);
        for (i = 0; i < inputs.length; i++) {
            form.appendChild(inputs[i]);
        }

        var input = document.createElement('input');
        input.type = 'file'; input.name = this.settings.name;
        if (this.settings.accept) input.accept = this.settings.accept;
        form.appendChild(input);

        this.input = input;
        this.form = form;

        var $trigger = $(this.settings.trigger);
        $(this.form).css({
            position: 'absolute',
            top: $trigger.offset().top,
            left: $trigger.offset().left,
            width: $trigger.outerWidth(),
            height: $trigger.outerHeight()
        }).appendTo('body');
        $(this.input).css({
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0,
            outline: 0,
            width: $trigger.outerWidth() * 2,
            height: $trigger.outerHeight() * 2
        });

        return this;
    };

    // bind events
    IframeUploader.prototype.bind = function() {
        var self = this;
        var $trigger = $(self.settings.trigger);
        $trigger.mouseenter(function() {
            $(self.form).css({
              top: $trigger.offset().top,
              left: $trigger.offset().left,
              width: $trigger.outerWidth(),
              height: $trigger.outerHeight()
            })
        });
        $(self.input).change(function() {
            if (!self.settings.change) return self.submit();
            var file = self.input.value;
            if (file) file = file.substr(file.lastIndexOf('\\') + 1);
            self.settings.change(file);
        });
    };

    // handle submit event
    // prepare for submiting form
    IframeUploader.prototype.submit = function() {
        var self = this;
        $('body').append(self.iframe);
        $(self.iframe).on('load', function() {
            var response = $(self.iframe).contents().find('body').html();
            $(self.iframe).off('load').remove();
            if (!response) {
                if (self.settings.error) self.settings.error(self.input.value);
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

    module.exports = IframeUploader;
});
