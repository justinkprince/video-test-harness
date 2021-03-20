import Logger from './logger.js';
import Player from './player.js';
import PlayerControls from './player-controls.js';
import PlayerNavigation from './player-navigation.js';

const logger = new Logger();

const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');

// Offload much of the video player logic to its own module.
const player = new Player({ videoElement: videoPlayer });

// Same with the controls logic.
const controls = new PlayerControls(player, videoContainer);

// Nav menu that sends content URLs to the player for it to load.
const playerNav = new PlayerNavigation();

const testStreamsManifestUrl =
  'https://vpe-static.bamgrid.com/sample-files/take-home-exam/test-streams.json';

// Fetch the test stream manifest.
fetch(testStreamsManifestUrl)
  .then((response) => response.json())
  .then((data) => {
    logger.log('Test stream response received');
    // Clear the "loading" text.
    playerNav.clear();

    data.streams.forEach((stream) => {
      // For each stream, create a button that loads the corresponding video
      // into the player.
      playerNav.addStreamButton({
        label: stream.title,
        handleClick: () => {
          player.load(stream.url);
          videoContainer.querySelector('.video-title').innerText = stream.title;
          controls.setEnabled(true);
        },
      });
    });
  });
