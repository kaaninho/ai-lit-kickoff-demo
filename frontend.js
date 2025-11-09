function showBlob() {
  const blob = document.getElementById("blob");
  blob.classList.add("active");
}

/*

Dauer der mp3-Dateien
1 antwort.mp3;4.832625
1 frage.mp3;3.395875
1 vorlesen.mp3;18.599125
2 antwort.mp3;8.202438
2 frage.mp3;4.048938
2 vorlesen.mp3;15.960812
3 antwort.mp3;11.467750
3 frage.mp3;2.194250
3 vorlesen.mp3;6.112625
4 antwort.mp3;5.955875
4 frage.mp3;2.847313
4 vorlesen.mp3;30.589375

*/

async function showBlobAndSpeak(section) {
  let readDuration;
  let questionDuration;
  let kidAnswerDuration;
  let answerDuration;
  if (section == 1) {
    readDuration = 18599
    questionDuration = 3395
    kidAnswerDuration = 5000
    answerDuration = 4832
  }
  else if (section == 2) {
    readDuration = 15960
    questionDuration = 4048
    kidAnswerDuration = 5000
    answerDuration = 8020
  }
  else if (section == 3) {
    readDuration = 6112
    questionDuration = 2194
    kidAnswerDuration = 5000
    answerDuration = 11467
  }
  else if (section == 4) {
    readDuration = 30589
    questionDuration = 2847
    kidAnswerDuration = 5000
    answerDuration = 5955
  }

  await new Promise(resolve => setTimeout(resolve, readDuration));
  showBlob();
  await new Promise(resolve => setTimeout(resolve, 1500 + 300));
  playTalkAnimation();
  await new Promise(resolve => setTimeout(resolve, questionDuration));
  stopTalkAnimation();  
  await new Promise(resolve => setTimeout(resolve, kidAnswerDuration));
  playTalkAnimation();
  await new Promise(resolve => setTimeout(resolve, answerDuration));
  stopTalkAnimation();  
}

$(document).ready(function () {
  $("#flipbook").turn({
    width: 1100,
    height: 700,
    autoCenter: true,
    duration: 1300, // Dauer der Animation in ms
    gradients: true,
    elevation: 80,
    display: "single",
    when: {
      turned: function (event, page, view) {
        console.log("Umgeblättert auf Seite: " + page);
      }
    }


  });

  $("#nextPage").click(() => {
    const blob = document.getElementById("blob");

    blob.classList.remove("active");

    $("#flipbook").turn("next")
  });
  $("#prevPage").click(() => {
    const blob = document.getElementById("blob");
    blob.classList.remove("active");

    $("#flipbook").turn("previous")
  });

  $("#vorlesenBtn").click(() => {
    blob.classList.remove("active");
    const currentPage = $("#flipbook").turn("page");

    vorlesen(currentPage);
    showBlobAndSpeak(currentPage)
  });
});

async function vorlesen(currentPage) {
  console.log("Vorlesen:", currentPage);
  const response = await fetch("http://127.0.0.1:3001/api/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section: currentPage })
  });
}

const totalFrames = 40;
let currentFrame = 1;
const imgElement = document.getElementById("blob");
let animationInterval;

function playTalkAnimation() {
    if (animationInterval) return; // Wenn schon läuft, nicht doppelt starten

    animationInterval = setInterval(() => {
    currentFrame++;
    if (currentFrame > totalFrames) currentFrame = 1; // Wieder von vorne
    imgElement.src = `images/talk/yellow_talk_${currentFrame}.png`;
  }, 50); // 50ms pro Frame = 20 FPS
}

function stopTalkAnimation() {
  clearInterval(animationInterval);
  animationInterval = null;
  imgElement.src = `images/talk/yellow_talk_1.png`;
}
