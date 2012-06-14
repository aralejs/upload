#!/usr/bin/env python

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        f = open('assets/demo.html')
        content = f.read()
        f.close()
        self.write(content)

    def post(self):
        f = self.request.files.get('file', None)
        if not f:
            self.write('{"stat": "fail", "msg": "no file"}')
            return
        f = f[0]
        filename = f.get('filename', '')
        self.write('{"stat": "ok", "msg": "get file %s"}' % filename)


def main():
    tornado.options.parse_command_line()
    application = tornado.web.Application([
        (r"/", MainHandler),
        ("/src/(.*)", tornado.web.StaticFileHandler, {'path': 'src/'}),
        ("/assets/(.*)", tornado.web.StaticFileHandler, {'path': 'assets/'}),
    ])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    print("Starting server at: 127.0.0.1:%s" % options.port)
    main()
