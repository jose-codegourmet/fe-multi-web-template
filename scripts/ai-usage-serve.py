#!/usr/bin/env python3
"""Serve only the usage dashboard on loopback, without exposing the repository."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?", 1)[0] not in ("/", "/index.html", "/dashboard.js", "/usage.csv", "/style.css"):
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        if self.path.split("?", 1)[0] not in ("/", "/index.html", "/dashboard.js", "/usage.csv", "/style.css"):
            self.send_error(404)
            return
        super().do_HEAD()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=9010)
    args = parser.parse_args()
    directory = Path(__file__).resolve().parents[1] / "ai-usage"
    server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(Handler, directory=str(directory)))
    print(f"AI usage dashboard: http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
