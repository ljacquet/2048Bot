from http.server import SimpleHTTPRequestHandler, HTTPServer
import time

hostName = "localhost"
hostPort = 9000

class AIServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        response = 404
        if self.path == '/':
            self.path = '/2048/2048.html'

        if self.path.find("/2048/") > -1:
            return SimpleHTTPRequestHandler.do_GET(self)

        self.send_response(404)
    
    def do_POST(self):
        if self.path == '/tick':
            self.send_response(200)
            self.send_header("Content-type", "text/json")
            self.end_headers()
            self.wfile.write(bytes("{ 'data': 'Response Information' }", 'utf-8'))
        else:
            self.send_response(404)

myServer = HTTPServer((hostName, hostPort), AIServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
