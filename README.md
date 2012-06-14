# iframe uploader


## DEMO

## Syntax

OOP style:

```javascript
var uploader = new IframeUploader({
    'trigger': '#upload-icon',
    'name': 'image',
    'action': '/upload',
    'data': {'xsrf': 'hash'},
    'success': function(response) {
        alert(response);
    }
});
```

Chain style:

```javascript
var uploader = new IframeUploader({
    'trigger': '#upload-icon',
    'name': 'image',
    'action': '/upload',
    'data': {'xsrf': 'hash'}
});
uploader.success(function(response) {
    alert(response);
});
```

data api support

```html
<a id="upload" data-name="image" data-action="/upload" data-data="a=a&b=b">Upload</a>
<script>
var uploader = new IframeUploader({'trigger': '#upload'});
uploader.success(function(response) {
    alert(response);
});
</script>
```
