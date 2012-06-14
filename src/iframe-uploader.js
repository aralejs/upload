// iframe uploader
// ===============
//

(function(factory) {
    if (typeof define === 'function') {
        // seajs support
        define(factory);
    } else if (typeof require === 'function') {
        // nodejs support
        factory(require, exports, module);
    } else {
        factory();
    }
})(function(require, exports, module) {
    var global = this;  // window

    var $;
    if (global.jQuery) {
        $ = global.jQuery;
    } else {
        $ = require('jquery');
    }

    function IframeUploader(options) {
        if (!(this instanceof IframeUploader)) {
            return new IframeUploader(options);
        }

        var settings = {
            'trigger': null,
            'name': 'file',
            'action': '/upload',
            'data': null,
            'change': null,
            'success': null
        };
        if (options) {
            $.extend(settings, options);
        }
        $trigger = $(settings.trigger);
        settings.action = settings.action || $trigger.data('action');
        settings.name = settings.name || $trigger.data('name');
        settings.data = settings.data || parse($trigger.data('data'));
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
        iframe.style.display = 'none'; iframe.href = 'javascript:;';
        iframe.name = 'iframe-uploader-' + now;
        this.iframe = iframe;

        var form = document.createElement('form');
        form.method = 'post'; form.enctype = 'multipart/form-data';
        form.target = iframe.name; form.action = this.settings.action;

        var inputs = createInputs(this.settings.data);
        for (i = 0; i < inputs.length; i++) {
            form.appendChild(inputs[i]);
        }

        var input = document.createElement('input');
        input.type = 'file'; input.name = this.settings.name;
        form.appendChild(input);

        this.input = input;
        this.form = form;
        return this;
    }

    // bind events
    IframeUploader.prototype.bind = function() {
        var self = this;
        $(self.form).css({position: 'absolute', left: '-9999px'}).
            appendTo('body');
        $(self.settings.trigger).click(function() {
            self.input.click();
            return false;
        });
        $(self.input).change(function() {
            if (!self.settings.change) return self.submit();
            var file = self.input.value;
            if (file) file = file.substr(file.lastIndexOf('\\') + 1);
            self.settings.change(file);
        });
    }

    // handle submit event
    // prepare for submiting form
    IframeUploader.prototype.submit = function() {
        var self = this;
        $('body').append(self.iframe);
        $(self.iframe).load(function() {
            var response = $(self.iframe).contents().find('body').html();
            if (self.settings.success) self.settings.success(response);
            $(self.iframe).unbind('load').remove();
        });
        self.form.submit();
        return this;
    }

    // handle change event
    // when value in file input changed
    IframeUploader.prototype.change = function(callback) {
        if (!callback) return this;
        this.settings.change = callback;
        return this;
    }

    // handle when upload success
    IframeUploader.prototype.success = function(callback) {
        if (!callback) return this;
        this.settings.success = callback;
        return this;
    }

    // Helpers
    // -------------

    function createInputs(data) {
        if (!data) return [];

        var inputs = [], i;
        for (name in data) {
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
        }

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = unescape(pair[0]);
            var val = unescape(pair[1]);
            ret[key] = val;
        }

        return ret;
    };

    // CommonJS compatable
    if (typeof module !== 'undefined') {
        module.exports = IframeUploader;
    } else {
        global.IframeUploader = IframeUploader;
    }
});
