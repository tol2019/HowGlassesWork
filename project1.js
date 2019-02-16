// video player code from youtube
var tag = document.createElement('script');

var scene = 0;

var vid0 = 'gnLNvZLhnXk';
vid = 'szKWM4lmPAU';

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '488',
    width: '800',
    videoId: vid0,
    playerVars: { 'autoplay': 0, 'controls': 0 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function loadVideo(id, startSeconds, endSeconds, suggestedQuality) {
  player.loadVideoById({
    'videoId': id,
    'startSeconds': startSeconds,
    'endSeconds': endSeconds,
    'suggestedQuality': suggestedQuality
  });

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}



// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for 3 seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && scene === 0) {
    // done = false;
    setTimeout(stopVideo, 3000);

  }

  if (player.getPlayerState() === 2) {

    $("#player").show();

    switch (scene) {
      case 1:
        loadVideo('szKWM4lmPAU', 5, 60, 'large');
        setTimeout(stopVideo, 2000);
        break;
      case 2:
        console.log(scene);
        loadVideo('WdxbRJx4JFk', 1, 5, 'large');
        setTimeout(stopVideo, 2000);
        break;
      case 3:
        // console.log("stage", scene);
        break;
      
      default:
        console.log("default");
    }

    if (scene === 3) {
      explore();
    }

  }
}



function stopVideo() {
  player.stopVideo();
  scene += 1;
}

function explore () {
  console.log("scene 3");
  $("#player").hide();
  // shwoing canvas
  var canvas = document.getElementById("main-canvas");
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fde8c7";
  ctx.fillRect(0, 0, 800, 600);
}