// canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");

$("#main-canvas").hide();
$("#next").hide();
$("#quiz").hide();
$(".glasses").hide();
$("#message").hide();

// stores which scene to play
var scene = 0;

var selected = 0;
var correct = 1;

// explore
var inExplore = true;

// quiz variables
var inQuiz = false;
var quiz = 0;

let x = [150, 496, 580, 690]
let y1 = [280, 280, 280, 300]
let y2 = [320, 320, 320, 300]


// video player code from youtube
var tag = document.createElement('script');

// var vid01 = 'gb304u_rMpo';
// var vid02 = '3OJXZnSBrE4';
// var vid03 = 'dhWzrwvgES4';

// updated combined video:
var vid01 = '7CHOtoRR8Gk';
var vid02 = '7CHOtoRR8Gk';
var vid03 = '7CHOtoRR8Gk';


var backgroundPlayed = false;

var paused = false;
var startedCalculating = false;




tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '600',
    width: '900',
    videoId: vid01,
    playerVars: { 'autoplay': 0, 'controls': 0 , 'showinfo': 0, 'modestbranding':1},
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

  let videoLength = endSeconds - startSeconds;
  videoLength *= 1000;

  calculateTime(videoLength);

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

function stopVideo() {
  player.stopVideo();
  scene += 1;

}

function calculateTime(videoLength){
  startedCalculating = true;
  let length = 0;
  console.log(videoLength);
  
  var interval = setInterval(function () {
    if(player.getPlayerState() === 2) { // paused
      paused = true;
    }
    if(player.getPlayerState() === 1) { // playing
      paused = false;
    }
    if (!paused) {
      length += 500;
    }
    console.log(length);

    if (length >= videoLength) {

      stopVideo();
      startedCalculating = false;
      clearInterval(interval);
      console.log("interval cleared");
    }

    $("#next").click(function(){
      clearInterval(interval);
    });

    $('#tell').click(function () {
      clearInterval(interval);
    });
  }, 500);

  
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for 3 seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && scene === 0 && !startedCalculating) {
    // done = false;
    // play the first video
    calculateTime(29000);
    // calculateTime(2000);

  }

  if (player.getPlayerState() === 2) {

    $("#player").show();

    switch (scene) {
      case 1:

        break;

      // case 4:
      //   console.log(scene);

      //   break;
      case 5:
        console.log(scene);
        // loadVideo(vid03, 66, 158, 'large');

        // setTimeout(stopVideo, 4000);
        break;

      default:
        console.log("default");
    }

    if (scene === 1) {
      // farsightedness
      correct = 1;
      explore();
    }

    if (scene === 5) {
      inQuiz = true;
      console.log("quiz");

      quiz = 1;
      doQuiz();

    }
  }
}



function explore() {
  // let glasses = 0;

  $("#player").css({'position':'absolute', 'top':"45%", 'left':'45%', 'width':'30px', 'height':'20px'});
  $(".glasses").show();
  $("#message").show();
  // $("#message p").html("Choose one of the three lenses to see if it helps our friend see clearly.");


  if(correct === 1) {
    var message = "The image on the right represents Greg's vision! Greg is nearsighted, try different types of lens and see how these lens affect his vision. When you think you figure out, click next one.";
  }
  if(correct === 2){
    var message = "Greg is farsighted, try different types of lens and see how these lens affect his vision.When you think you figure out, click next one.";
  }

  if(correct === 3){
    var message = "Greg now has perfect vision, try different types of lens and see how these lens affect his vision.When you think you figure out, click next one.";
  }

  $("#message p").html(message);

  console.log("scene 3");
  // $("#player").hide();
  $("#main-canvas").show();
  // shwoing canvas
  clearCanvas();
  drawBackground();
  // drawInitialImage();
  initializeLines();
  drawLines();
  drawCorrectedImage();

  $(".glasses").click(function () {
    $(".glasses").css({ "border": "1px solid aquamarine" });
    $("#" + this.id).css({ "border": "2px solid black" });

    clearCanvas();
    drawBackground();
    initializeLines();

    // drawCorrectedImage();

    let glassesimg = new Image();
    glassesimg.onload = function () {
      ctx.drawImage(glassesimg, 480, 220, 32, 160);
    }

    switch (this.id) {
      case "1":
        selected = 1;
        glassesimg.src = "assets/img/concave.png";

        drawCorrectedImage();

        x[3] += 20;
        y1[2] -= 10;
        y2[2] += 10;


        break;
      case "2":
        selected = 2;
        glassesimg.src = "assets/img/convex.png";
        drawCorrectedImage();

        x[3] -= 20;
        y1[2] += 10;
        y2[2] -= 10;


        break;

      case "3":
        selected = 3;
        glassesimg.src = "assets/img/flat.png";

        drawCorrectedImage();
        break;

      default:
        console.log("sth went wrong");
    }

    drawLines();

    if (inExplore){
      checkAnswer();
    }

    
  });
}

function doQuiz() {
  let correct_choice = 0;
  let feedback = '';
  let choice01 = '';
  let choice02 = '';
  let choice03 = '';
  console.log("quiz");
  $("#player").hide();
  $("#quiz").show();

  if (inQuiz) {
    $("#message").hide();
    $("#choose-one").hide();
    switch (quiz) {
      case 1:
        correct_choice = 1;
        $("#problem-statement").html("Q1: If our friend, Greg, has myopic eyes, which type of lens does he need?");
        choice01 = "<button id=1 class='choices btn btn-outline-secondary'>concave</button>"
        choice02 = "<button id=2 class='choices btn btn-outline-secondary'>convex</button>"
        choice03 = "<button id=3 class='choices btn btn-outline-secondary'>flat</button>"
        $("#choices").html("").append(choice01).append(choice02).append(choice03);
        $(".choices").click(function () {
          if (this.id == correct_choice) {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-success");
            feedback = "<p>Well done! Concave lenses are used to correct myopic eyes. Convex ones are used for farsightedness people, and flat ones does not have correction effects.</p>";
            $("#feedback-correct").append(feedback);
            let nextButton = "<button id='next-quiz' class='btn btn-outline-dark'>Next Problem</button>";
            $("#feedback-correct").append(nextButton);
            $("#next-quiz").click(function () {
              quiz = 2;
              $("#feedback-correct").html("");
              doQuiz();
            });
          } else {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-danger");
            if (this.id == 2) {
              feedback = "Ooops! Actually, convex lenses are used for farsightedness. Since our friend has myopic eyes, which is nearsightedness, we need to use concave lenses. ";
            }
            if (this.id == 3) {
              feedback = "Actually, flat lenses won't be able to help our friend see clearly. ";
            }
            $("#feedback-incorrect").append(feedback);
            var againButton = "<button id='again-quiz' class='btn btn-outline-dark'>Try Again!</button>"
            $("#feedback-incorrect").append(againButton);
            $("#again-quiz").click(function () {
              $("#feedback-incorrect").html("");
              doQuiz();
            });
          }
          $(".choices").attr('disabled', 'disabled');
        });
        break;
      case 2:
        correct_choice = 3;
        $("#problem-statement").html("Q2: The picture on the left shows the light path when there is no lenses. If we put a lens there, as the right picture shows, where would the light focus?");
        $("#problem-statement").append("<img src='./assets/img/Q2-01.png' >")
        choice01 = "<button id=1 class='choices btn btn-outline-secondary'>Point A</button>"
        choice02 = "<button id=2 class='choices btn btn-outline-secondary'>Point B</button>"
        choice03 = "<button id=3 class='choices btn btn-outline-secondary'>Point C</button>"
        $("#choices").html("").append(choice01).append(choice02).append(choice03);
        $(".choices").click(function () {
          if (this.id == correct_choice) {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-success");
            feedback = "<p>Right! This is a concave lens, and it expands light passing through. Thus the light would focus at Point C. Good job!</p>";
            $("#feedback-correct").append(feedback);
            var nextButton = "<button id='next-quiz' class='btn btn-outline-dark'>Next Problem!</button>"
            $("#feedback-correct").append(nextButton);

            $("#next-quiz").click(function () {
              quiz = 3;
              $("#feedback-correct").html("");
              doQuiz();
            });
          } else {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-danger");
            if (this.id == 1) {
              feedback = "Not quite. If the lens is a convex one, then the light will focus on Point A. But in the picture we used a concave lens. Try again!";
            }
            if (this.id == 2) {
              feedback = "Not quite. If the lens is a flat one, then the light will focus on Point B. But in the picture we used a concave lens. Try again!";
            }
            $("#feedback-incorrect").append(feedback);
            var againButton = "<button id='again-quiz' class='btn btn-outline-dark'>Try Again!</button>"
            $("#feedback-incorrect").append(againButton);
            $("#again-quiz").click(function () {
              $("#feedback-incorrect").html("");
              doQuiz();
            });
          }
          $(".choices").attr('disabled', 'disabled');

        });
        break;
      case 3:

        correct_choice = 1;
        $("#problem-statement").html("Q3: In the picture below, light passes through a lens in the box and changes its path. Do you know which type of lens it is?");
        $("#problem-statement").append("<img src='./assets/img/Q3-01.png' >")
        choice01 = "<button id=1 class='choices btn btn-outline-secondary'>Convex</button>"
        choice02 = "<button id=2 class='choices btn btn-outline-secondary'>Concave</button>"
        choice03 = "<button id=3 class='choices btn btn-outline-secondary'>Flat</button>"
        $("#choices").html("").append(choice01).append(choice02).append(choice03);
        $(".choices").click(function () {
          if (this.id == correct_choice) {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-success");
            feedback = "You did it! Since the light is narrowed, we can infer that the lens in the box is a convex one. Good job!";
            $("#feedback-correct").append(feedback);
            var nextButton = "<button id='next-quiz' class='btn btn-outline-dark'>Finish!</button>"
            $("#feedback-correct").append(nextButton);
            $("#next-quiz").click(function () {
              quiz = 4;
              $("#feedback-correct").html("");
              doQuiz();
            });
          } else {
            $("#choices #" + this.id.toString()).removeClass("btn-outline-secondary").addClass("btn-outline-danger");
            if (this.id == 2) {
              feedback = "Not quite. A concave lens will expand the light a bit, so the light path will go toward the outside. Try again!";
            }
            if (this.id == 3) {
              feedback = "Nope. A flat lens won't change the light path. Try again!";
            }
            $("#feedback-incorrect").append(feedback);
            var againButton = "<button id='again-quiz' class='btn btn-outline-dark'>Try Again!</button>"
            $("#feedback-incorrect").append(againButton);
            $("#again-quiz").click(function () {
              $("#feedback-incorrect").html("");
              doQuiz();
            });
          }
          $(".choices").attr('disabled', 'disabled');
        });
        break;
      default:
        console.log("Quiz: sth wrong");
        alert("Congratulations! You have finished this mini lecture. Good job!")
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(0, 0, 1024, 600);

  let eyeimg = new Image();
  eyeimg.onload = function () {
    ctx.drawImage(eyeimg, 540, 220, 160, 160);
  }
  eyeimg.src = "assets/img/eyeball.svg";

  let originalimg = new Image();
  originalimg.onload = function () {
    ctx.drawImage(originalimg, 50, 250, 100, 100);
  }
  originalimg.src = "assets/img/vision_clear.png";

  ctx.font = "18px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Object", 95, 400);
  ctx.fillText("Light", 360, 380);
  ctx.fillText("Vision", 850, 450);
  ctx.fillText("Eyes", 600, 400);
}

function checkAnswer() {
  if (selected === correct) {
    // $("#message p").html("Good! Your helped our friend see clearly. Let's go on and try in another situation! You can also play around on this situation to see the effects.");
    

    inExplore = false;
    
    // $('.glasses').hide();
    $("#message").append("<button class='btn btn-outline-secondary' id='next'>Next One!</button>")
    // $("#next").show();

    $("#next").click(function () {
      inExplore = true;
      correct += 1;
      $(".glasses").css({ "border": "1px solid aquamarine" });
      // $("#message p").html("");

      if(correct === 1) {
        var message = "The image on the right represents Greg's vision! Greg is nearsighted, try different types of lens and see how these lens affect his vision. When you think you figure out, click next one.";
      }
      if(correct === 2){
        var message = "Greg is farsighted, try different types of lens and see how these lens affect his vision.When you think you figure out, click next one.";
      }

      if(correct === 3){
        var message = "Greg now has perfect vision, try different types of lens and see how these lens affect his vision.When you think you figure out, click next one.";
      }

      $("#message p").html(message);
      selected = 0;
      // $(".glasses").show();
      $("#next").remove();
      backgroundPlayed = false;
      stopVideo();
      // scene = 1;
      clearCanvas();
      drawBackground();
      initializeLines();
      drawLines();
      drawCorrectedImage();
    });
  } else {
    // $("#message p").html("Ah oh... it seems Greg can still not see it clearly. Lets's try another one!");
  }

  if (correct >= 3 && selected === correct) {
    $("#message p").html("Good! Your helped our friend see clearly. Now it's time to learn more about how glasses work. Let's go to the video!");
    var nextButton = "<button id='tell' class='btn btn-outline-secondary'>Let's Watch A Video!</button>"
    $("#next").hide();
    $("#tell").remove();
    $("#message").append(nextButton);
    $('#tell').click(function () {
      stopVideo();
      $("#player").removeAttr("style").css({'margin':'0 auto', 'display':'block', 'width':'900px', 'height':'600px'});
      console.log("tell");
      scene = 4;
      loadVideo(vid02, 33, 152, 'large');
      // setTimeout(stopVideo, 126000);
      $("#main-canvas").hide();
      $(".glasses").hide();
      $("#message").hide();
      $("#player").show();
    });
  }

}

function drawCorrectedImage() {
  let img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 750, 200, 200, 200);
  }

  img.src = "assets/img/vision_blur.png";

  if (selected === correct) {
    img.src = "assets/img/vision_clear.png";
  }
  
  if (correct !== 3 && selected === 3) {
    img.src = "assets/img/vision_blur.png";
  } 
  
  if (correct === 1 && selected === 2 || correct === 2 && selected === 1) {
    console.log("more blur")
    img.src = "assets/img/vision_blur more.png";
  } 

  if (correct === 3) {
    img.src = "assets/img/vision_clear.png";
    if(selected !== 0 && selected !== 3){
      console.log("case 3, wrong answer");
      img.src = "assets/img/vision_blur.png";
    }
  } 

}

function initializeLines() {


  x = [150, 496, 580, 690];
  y1 = [280, 280, 280, 300];
  y2 = [320, 320, 320, 300];

  switch (correct) {
    case 1:
      if (!backgroundPlayed) {
        loadVideo(vid01, 153, 194, 'large');
        backgroundPlayed = true;
      }
      x[3] -= 20

      break;
    case 2:
      if (!backgroundPlayed) {
        loadVideo(vid01, 196, 220, 'large');
        backgroundPlayed = true;
      }

      x[3] += 20
      break;
    case 3:
      if (!backgroundPlayed) {
        loadVideo(vid01, 219, 240, 'large');
        backgroundPlayed = true;
      }

      break;
    default:
      console.log("something wrong");
  }
}

function drawLines() {
  canvas = document.getElementById("main-canvas");
  ctx = canvas.getContext("2d");
  ctx.beginPath();
  console.log(x)
  ctx.moveTo(x[0], y1[0]);
  ctx.lineTo(x[1], y1[1]);
  ctx.lineTo(x[2], y1[2]);
  ctx.lineTo(x[3], y1[3]);
  ctx.moveTo(x[0], y2[0]);
  ctx.lineTo(x[1], y2[1]);
  ctx.lineTo(x[2], y2[2]);
  ctx.lineTo(x[3], y2[3]);
  ctx.stroke();
}