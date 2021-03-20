.PHONY: server-node server-py2 server-py3

SERVER_RUNNING_MESSAGE := Server running at http://127.0.0.1:7777/

server-node:
	node http/server-node.js

server-py2:
	@python -m SimpleHTTPServer 7777 --directory dist/ || true
	$(info $(SERVER_RUNNING_MESSAGE))

server-py3:
	@python -m http.server 7777 --directory dist/ || true
	$(info $(SERVER_RUNNING_MESSAGE))
