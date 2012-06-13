# Author: Hsiaoming Yang <lepture@me.com>
# Website: http://lepture.com

.PHONY: doc publish


doc:
	doki.py -l js -t default --title=iframe-uploader --github=iframe-uploader README.md > index.html

publish:
	git push origin gh-pages
