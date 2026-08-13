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

let moveTimer = null;
let timer = null;


// =========================
// SPEED SETTINGS
// =========================

// سرعت شروع
const START_SPEED = 1000;

// میزان افزایش سرعت
const SPEED_STEP = 12;

// سریع‌تر از این نشود
const MIN_SPEED = 550;

let speed = START_SPEED;


// =========================
// START GAME
// =========================

startBtn.onclick = startGame;


function startGame() {

    playerName =
        playerNameInput.value.trim();


    if (playerName === "") {

        alert(
            "لطفاً اسم خودت را وارد کن"
        );

        playerNameInput.focus();

        return;
    }


    score = 0;

    lives = 3;

    timeLeft = 180;

    speed = START_SPEED;

    running = true;


    clearInterval(moveTimer);
    clearInterval(timer);


    startBtn.disabled = true;

    startBtn.textContent =
        "🎮 بازی در حال اجرا";


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
        setInterval(
            function () {

                if (!running) {
                    return;
                }


                timeLeft--;

                updateTime();


                if (timeLeft <= 0) {

                    endGame(false);

                }

            },
            1000
        );
}


// =========================
// SHOW TARGET
// =========================

function showTarget() {

    if (!running) {
        return;
    }


    clearBoard();


    const random =
        Math.floor(
            Math.random() * holes.length
        );


    currentHole =
        holes[random];


    const image =
        document.createElement("img");


    /*
        35 درصد = دماغ
        65 درصد = فتاح
    */

    if (Math.random() < 0.35) {

        currentType = "bomb";

        image.src =
            "bomb.png";

        image.alt =
            "دماغ";

    }

    else {

        currentType = "target";

        image.src =
            "target.png";

        image.alt =
            "فتاح";

    }


    image.className =
        "game-image";


    currentHole.appendChild(
        image
    );
}


// =========================
// CLICK
// =========================

holes.forEach(
    function (hole) {

        hole.onclick =
            function () {

                if (!running) {
                    return;
                }


                if (
                    hole !== currentHole
                ) {
                    return;
                }


                // =================
                // BOMB / NOSE
                // =================

                if (
                    currentType === "bomb"
                ) {

                    lives--;


                    message.textContent =
                        "💣 اشتباه زدی!";


                    updateUI();


                    clearBoard();


                    if (lives <= 0) {

                        endGame(true);

                        return;

                    }

                }


                // =================
                // TARGET / FATAH
                // =================

                else {

                    score++;


                    message.textContent =
                        "🔥 آفرین!";


                    increaseSpeed();


                    updateUI();


                    clearBoard();

                }

            };

    }
);


// =========================
// SPEED
// =========================

function increaseSpeed() {

    /*
        سرعت خیلی آرام زیاد می‌شود.

        score = 0
        1000ms

        score = 10
        880ms

        score = 20
        760ms

        score = 30
        640ms

        حداقل = 550ms
    */


    speed =
        Math.max(
            MIN_SPEED,
            START_SPEED -
            (score * SPEED_STEP)
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

async function endGame(
    lostAllLives = false
) {

    if (!running) {
        return;
    }


    running = false;


    clearInterval(moveTimer);
    clearInterval(timer);


    moveTimer = null;
    timer = null;


    clearBoard();


    // =========================
    // LOST
    // =========================

    if (lostAllLives) {

        startBtn.disabled = false;

        startBtn.textContent =
            "🔄 دوباره بازی کن";


        message.textContent =
            "💥 باختی! امتیازت: " +
            score;

    }


    // =========================
    // TIME OVER
    // =========================

    else {

        startBtn.disabled = false;

        startBtn.textContent =
            "🔄 دوباره بازی کن";


        message.textContent =
            "⏱️ زمان تمام شد! امتیازت: " +
            score;

    }


    await saveScore();

}


// =========================
// SAVE SCORE
// =========================

async function saveScore() {

    if (!playerName) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("scores")
            .insert([
                {
                    name: playerName,
                    score: score
                }
            ]);


    if (error) {

        console.error(
            "Supabase save error:",
            error
        );

    }

}


// =========================
// SCORE TABLE
// =========================

scoresBtn.onclick =
    loadScores;


async function loadScores() {

    scoresModal.classList.add(
        "open"
    );


    scoreList.innerHTML =
        "در حال دریافت...";


    const { data, error } =
        await supabaseClient
            .from("scores")
            .select("name, score")
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .limit(10);


    if (error) {

        console.error(
            "Supabase score error:",
            error
        );


        scoreList.innerHTML =
            "❌ خطا در دریافت امتیازات";


        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        scoreList.innerHTML =
            "🏆 هنوز رکوردی ثبت نشده";


        return;
    }


    scoreList.innerHTML = "";


    data.forEach(
        function (item, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "score-row";


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                (index + 1) +
                " - " +
                item.name;


            const points =
                document.createElement(
                    "strong"
                );


            points.textContent =
                Number(item.score) || 0;


            row.appendChild(name);

            row.appendChild(points);

            scoreList.appendChild(row);

        }
    );

}


// =========================
// GUIDE
// =========================

guideBtn.onclick =
    function () {

        guideModal.classList.add(
            "open"
        );

    };


closeGuide.onclick =
    function () {

        guideModal.classList.remove(
            "open"
        );

    };


// =========================
// CLOSE SCORE TABLE
// =========================

closeScores.onclick =
    function () {

        scoresModal.classList.remove(
            "open"
        );

    };


// =========================
// CLOSE GUIDE OUTSIDE
// =========================

guideModal.onclick =
    function (event) {

        if (
            event.target === guideModal
        ) {

            guideModal.classList.remove(
                "open"
            );

        }

    };


// =========================
// CLOSE SCORES OUTSIDE
// =========================

scoresModal.onclick =
    function (event) {

        if (
            event.target === scoresModal
        ) {

            scoresModal.classList.remove(
                "open"
            );

        }

    };


// =========================
// UI
// =========================

function updateUI() {

    scoreText.textContent =
        score;


    livesText.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(
            3 - lives
        );


    updateTime();

}


// =========================
// TIME
// =========================

function updateTime() {

    const min =
        Math.floor(
            timeLeft / 60
        );


    const sec =
        timeLeft % 60;


    timeText.textContent =
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0");

}


// =========================
// CLEAR BOARD
// =========================

function clearBoard() {

    holes.forEach(
        function (hole) {

            hole.innerHTML = "";

        }
    );


    currentHole = null;

    currentType = "";

}


// =========================
// INITIAL
// =========================

updateUI();
