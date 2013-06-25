# Upload

---------------

iframe and html5 uploader.


## DEMO

Install requirements:

```
$ npm install
```

Start server with:

```
$ node server.js
```

Now open your browser: http://127.0.0.1:8000/demo.html


## API

Create a uploader:

```javascript
var uploader = new Uploader({
    trigger: '#upload-icon',
    name: 'image',
    action: '/upload',
    accept: 'image/*',
    data: {'xsrf': 'hash'},
    error: function(file) {
        alert(file);
    },
    success: function(response) {
        alert(response);
    }
});
```

- trigger: a valid jQuery selector
- name: name of the file input. for example 'file', 'image'.
- action: form's action. Where to post your file.
- accept: file input accept attribute
- data: extra data that you want to post, for example 'xsrf'
- error: error callback
- success: success callback


Chain style:

```javascript
var uploader = new Uploader({
    trigger: '#upload-icon',
    name: 'image',
    action: '/upload',
    data: {'xsrf': 'hash'}
}).success(function(response) {
    alert(response);
}).error(function(file) {
    alert(file);
});
```

data api support

```html
<a id="upload" data-name="image" data-action="/upload" data-data="a=a&b=b">Upload</a>
<script>
var uploader = new Uploader({'trigger': '#upload'});
// more friendly way
// var uploader = new Uploader('#upload');
uploader.success(function(response) {
    alert(response);
});
</script>
```

## Advanced

Demo in **API** section could not be controlled. When you select a file, it will
be submitted immediately. We can broke the chain with ``change``:

```javascript
var uploader = new Uploader({
    trigger: '#upload-icon',
    name: 'image',
    action: '/upload',
    data: {'xsrf': 'hash'}
}).change(function(filename) {
    alert('you are selecting ' + filename);
    // Default behavior of change is
    // this.submit();
}).success(function(response) {
    alert(response);
});
```

Now you should handle it yourself:

```javascript
$('#submit').click(function() {
    uploader.submit();
});
```


## Show Progress

It is impossible to show progress, but you can make a fake prgress.


```javascript
var uploader = new Uploader({
    trigger: '#upload-icon',
    name: 'image',
    action: '/upload',
    data: {'xsrf': 'hash'}
}).change(function(filename) {
    // before submit
    $('#progress').text('Uploading ...');
    this.submit();
}).success(function(response) {
    $('#progress').text('Success');
    alert(response);
});
```


## Seajs Hint

Load uploader with seajs:

```javascript
seajs.use('upload', function(Uploader) {
    var uploader = new Uploader({
    });
});
```

## Changelog

**2013-06-25** `1.0.0`

Combine iframe and html5 uploader.
