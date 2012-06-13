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
    if (typeof jQuery === 'undefined') {
        var $ = require('jquery');
    }

    function IframeUploader(options) {
        var settings = {
            'trigger': null,
            'name': null,
            'action': null,
            'data': null,
            'change': null,
            'success': null
        };
        if (options) {
            $.extend(settings, options);
        }
        $trigger = $(trigger);
        settings.action = settings.action || $trigger.data('action');
        settings.name = settings.name || $trigger.data('name');
        settings.data = settings.data || $trigger.data('data');
        settings.success = settings.success || $trigger.data('success');
        this.settings = settings;

        this.setup();
        this.bind();
        return this;
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
        $(this.form).css({position: 'absolute', left: '-9999px'}).
            appendTo('body');
        $(this.settings.trigger).click(function() {
            this.input.click();
        });
        $(this.input).change(function() {
            if (!this.settings.change) return this.submit();
            var file = this.input.value;
            if (file) file = file.substr(file.lastIndexOf('\\') + 1);
            this.settings.change(file);
        });
    }

    // handle submit event
    // prepare for submiting form
    IframeUploader.prototype.submit = function() {
        $('body').append(this.iframe);
        $(this.iframe).load(function() {
            var response = this.iframe.contents().find('body').html();
            if (this.settings.success) this.settings.success(response);
            $(this.iframe).unbind('load').remove();
        });
        this.form.submit();
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


    // CommonJS compatable
    if (typeof module !== 'undefined') {
        module.exports = IframeUploader;
    } else {
        global.selection = IframeUploader;
    }
    // jQuery plugin support
    $.fn.IframeUploader = IframeUploader;
});
