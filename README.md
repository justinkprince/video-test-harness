# Video test harness

A simple test harness for our HTML5 platform that allows users to play test streams on a video player.

## Requirements

This project relies upon newer features of JavaScript and therefore it must be run in either Chrome v63+ (recommended) or Firefox v67+ to be safe.

To run this app locally, you will need to start a web server.

Included in this project are three scripts to run a configured web server: one for Node.js, one for Python v3, and yet another for Python v2.

If you have Make installed, this process is super simple.

## Do I have Make installed?

If running `which make` your terminal prints out a path, you're in good shape.

### Make with Python 3

Just run `make server-py3` in your terminal. A web server will start right up. Just open your browser and navigate to [http://localhost:7777/](http://localhost:7777/)

### Make with Python 2

Very simliar to v3, just run `make server-py2` in your terminal. A web server will start right up. Just open your browser and navigate to [http://localhost:7777/](http://localhost:7777/)

### Make with Node.js

Just run `make server-node` in your terminal. A web server will start right up. Just open your browser and navigate to [http://localhost:7777/](http://localhost:7777/)

## I do not have Make installed

If you don't have Make installed but do have one of the three runtimes listed above, you can simply run one of the commands with little modification `Makefile` directly in your terminal. Here they are for convenience:

**Python v3**
```
python -m http.server 7777 --directory dist/
```
**Python v2**
```
python -m SimpleHTTPServer 7777 --directory dist/
```
**Node**
```
node http/server-node.js
```

## To use

Once the app is running in your browser, click on one of the buttons along the left side of the page to load a video stream into the video player. Autoplay is not enabled so you must click the Play button for the video to start.

Enjoy!