// =========================
// SUPABASE
// =========================

const SUPABASE_URL =
"https://wfkaiaovdvoiqfdgjugl.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_sSDFcZuD1Chlr6EbEWJ-AA_QVnJkHS1";


const supabaseClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);



// =========================
// ELEMENTS
// =========================

const holes =
document.querySelectorAll(".hole");


const scoreText =
document.getElementById("score");


const timeText =
document.getElementById("gameTime");


const livesText =
document.getElementById("lives");


const startBtn =
document.getElementById("startBtn");


const message =
document.getElementById("gameMessage");


const playerNameInput =
document.getElementById("playerName");



const guideBtn =
document.getElementById("guideBtn");


const guideModal =
document.getElementById("guideModal");


const closeGuide =
document.getElementById("closeGuide");



const scoresBtn =
document.getElementById("scoresBtn");


const scoresModal =
document.getElementById("scoresModal");


const closeScores =
document.getElementById("closeScores");


const scoreList =
document.getElementById("scoreList");




// =========================
// GAME VARIABLES
// =========================

let score = 0;

let lives = 3;

let timeLeft = 180;

let playerName = "";

let running = false;


let currentHole = null;

let currentType = "";

let moveTimer;

let timer;

let speed = 900;





// =========================
// START
// =========================


startBtn.onclick = startGame;



function startGame(){


playerName =
playerNameInput.value.trim();



if(playerName === ""){

    alert(
        "لطفاً اسم خودت را وارد کن"
    );

    return;

}



score = 0;

lives = 3;

timeLeft = 180;

speed = 900;


running = true;



startBtn.disabled = true;


message.textContent =
"🎯 شروع شد!";



updateUI();



showTarget();



moveTimer =
setInterval(
    showTarget,
    speed
);



timer =
setInterval(()=>{


timeLeft--;


updateTime();



if(timeLeft <= 0){

    endGame();

}



},1000);



}









// =========================
// SHOW TARGET
// =========================


function showTarget(){


if(!running)
return;



clearBoard();



let random =
Math.floor(
Math.random()*holes.length
);



currentHole =
holes[random];



let image =
document.createElement("img");



if(Math.random() < 0.2){


currentType = "bomb";


image.src =
"bomb.png";


}

else{


currentType = "target";


image.src =
"target.png";


}



image.className =
"game-image";



currentHole.appendChild(image);


}









// =========================
// CLICK
// =========================


holes.forEach(hole=>{


hole.onclick = ()=>{


if(!running)
return;



if(hole !== currentHole)
return;



if(currentType === "bomb"){


lives--;


message.textContent =
"💣 اشتباه زدی!";


}

else{


score++;


message.textContent =
"🔥 آفرین!";


increaseSpeed();


}



updateUI();


clearBoard();



if(lives <= 0){

    endGame();

}



};



});









// =========================
// SPEED
// =========================


function increaseSpeed(){


speed =
Math.max(
250,
900 - score * 35
);



clearInterval(moveTimer);



moveTimer =
setInterval(
showTarget,
speed
);


}









// =========================
// END GAME
// =========================


async function endGame(){


running = false;



clearInterval(moveTimer);

clearInterval(timer);



clearBoard();



await saveScore();



startBtn.disabled = false;


startBtn.textContent =
"🔄 دوباره بازی کن";



message.textContent =
"🏁 پایان | امتیاز: "
+
score;



}









// =========================
// SAVE SCORE
// =========================


async function saveScore(){


const {error} =

await supabaseClient
.from("scores")
.insert([

{

name: playerName,

score: score

}

]);



if(error){

console.log(error);

}

else{

console.log(
"Score Saved"
);

}



}









// =========================
// SCORE TABLE
// =========================


scoresBtn.onclick =
loadScores;



async function loadScores(){


scoresModal.classList.add(
"open"
);



scoreList.innerHTML =
"در حال دریافت...";



const {data,error} =

await supabaseClient
.from("scores")
.select("*")
.order(
"score",
{
ascending:false
}
)
.limit(10);




if(error){


scoreList.innerHTML =
"خطا در دریافت امتیازات";


console.log(error);


return;

}




if(!data || data.length===0){


scoreList.innerHTML =
"هنوز رکوردی ثبت نشده";


return;


}




scoreList.innerHTML = "";


data.forEach((item,index)=>{


scoreList.innerHTML +=

`

<div class="score-row">

${index+1} -
${item.name}

<strong>
${item.score}
</strong>

</div>

`;



});



}








// =========================
// GUIDE
// =========================


guideBtn.onclick = ()=>{


guideModal.classList.add(
"open"
);


};



closeGuide.onclick = ()=>{


guideModal.classList.remove(
"open"
);


};






closeScores.onclick = ()=>{


scoresModal.classList.remove(
"open"
);


};








// =========================
// UI
// =========================


function updateUI(){


scoreText.textContent =
score;


livesText.textContent =

"❤️".repeat(lives)
+
"🖤".repeat(
3-lives
);



updateTime();


}




function updateTime(){


let min =
Math.floor(
timeLeft/60
);



let sec =
timeLeft%60;



timeText.textContent =

String(min).padStart(2,"0")
+
":"
+
String(sec).padStart(2,"0");


}






function clearBoard(){


holes.forEach(hole=>{


hole.innerHTML="";


});


currentHole=null;


}