// =========================
// منوی سه خط
// =========================

function openMenu(){

    let menu = document.getElementById("menuBox");


    if(menu.style.display === "block"){

        menu.style.display = "none";

    }else{

        menu.style.display = "block";

    }

}





// =========================
// تایمر 15 روزه MR.YELLOW
// =========================


let endTime = localStorage.getItem("MR_YELLOW_TIMER");



if(!endTime){

    endTime =
    new Date().getTime()
    +
    (15 * 24 * 60 * 60 * 1000);


    localStorage.setItem(
        "MR_YELLOW_TIMER",
        endTime
    );

}




function updateTimer(){


    let now = new Date().getTime();


    let distance = endTime - now;



    let days =
    Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );



    let hours =
    Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );



    let minutes =
    Math.floor(
        (distance / (1000 * 60)) % 60
    );



    let seconds =
    Math.floor(
        (distance / 1000) % 60
    );




    document.getElementById("days").innerHTML = days;


    document.getElementById("hours").innerHTML = hours;


    document.getElementById("minutes").innerHTML = minutes;


    document.getElementById("seconds").innerHTML = seconds;



}



setInterval(updateTimer,1000);


updateTimer();






// =========================
// حالت لایو
// =========================


// false = آفلاین 🔴
// true = لایو 🟢


let liveMode = false;



if(liveMode){


    let live =
    document.getElementById("liveStatus");



    live.classList.remove("offline");


    live.classList.add("online");


    live.innerHTML =
    "🟢 LIVE NOW";


}