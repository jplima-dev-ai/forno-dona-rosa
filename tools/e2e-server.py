from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class FornoE2EServer(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True
    allow_reuse_address = True

if __name__ == "__main__":
    server = FornoE2EServer(("127.0.0.1", 4173), SimpleHTTPRequestHandler)
    print("Forno E2E server listening on http://127.0.0.1:4173", flush=True)
    try:
        server.serve_forever(poll_interval=0.1)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
