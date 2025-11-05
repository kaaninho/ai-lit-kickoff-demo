console.log("TEST")

function showBlob() {
  const blob = document.getElementById("blob");
  blob.classList.add("active");
  console.log("MOVED")
}

async function showBlobAfter(time) {
  await new Promise(resolve => setTimeout(resolve, time));
  showBlob();
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
    const currentPage = $("#flipbook").turn("page");

    vorlesen(currentPage);

    if (currentPage == 1) {showBlobAfter(19000)}
    else if (currentPage == 2) {showBlobAfter(16000)}
    else if (currentPage == 3) {showBlobAfter(6000)}
    else if (currentPage == 4) {showBlobAfter(31000)}
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
