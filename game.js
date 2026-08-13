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

const holes = document.querySelectorAll(".hole");

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
let gameTimer = null;


// =========================
// GAME SPEED
// =========================

const GAME_SPEED = 1000;


// =========================
// START GAME
// =========================

startBtn.addEventListener(
    "click",
    startGame
);


function startGame() {

    playerName =
        playerNameInput.value.trim();


    if (!playerName) {

        message.textContent =
            "⚠️ اول اسمت رو وارد کن";

        playerNameInput.focus();

        return;
    }


    score = 0;
    lives = 3;
    timeLeft = 180;

    running = true;


    clearInterval(moveTimer);
    clearInterval(gameTimer);


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
            GAME_SPEED
        );


    gameTimer =
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


    const index =
        Math.floor(
            Math.random() * holes.length
        );


    currentHole =
        holes[index];


    const image =
        document.createElement("img");


    // 35 درصد دماغ
    // 65 درصد فتاح

    if (Math.random() < 0.35) {

        currentType = "bomb";

        image.src = "bomb.png";

        image.alt = "دماغ";

    }

    else {

        currentType = "target";

        image.src = "target.png";

        image.alt = "فتاح";

    }


    image.className =
        "game-image";


    currentHole.appendChild(image);
}


// =========================
// CLICK HOLES
// =========================

holes.forEach(
    function (hole) {

        hole.addEventListener(
            "click",
            function () {

                if (!running) {
                    return;
                }


                if (
                    hole !== currentHole
                ) {
                    return;
                }


                // دماغ

                if (
                    currentType === "bomb"
                ) {

                    lives--;


                    message.textContent =
                        "💣 دماغ بود!";


                    updateUI();


                    clearBoard();


                    if (lives <= 0) {

                        endGame(true);

                    }

                    return;
                }


                // فتاح

                score++;


                message.textContent =
                    "🔥 آفرین!";


                updateUI();


                clearBoard();

            }
        );

    }
);


// =========================
// END GAME
// =========================

async function endGame(
    lostAllLives
) {

    if (!running) {
        return;
    }


    running = false;


    clearInterval(moveTimer);
    clearInterval(gameTimer);


    moveTimer = null;
    gameTimer = null;


    clearBoard();


    if (lostAllLives) {

        message.textContent =
            "💥 باختی! امتیازت: " +
            score;

    }

    else {

        message.textContent =
            "⏱️ زمان تمام شد! امتیازت: " +
            score;

    }


    startBtn.disabled = false;

    startBtn.textContent =
        "🔄 دوباره بازی کن";


    await saveScore();

}


// =========================
// SAVE SCORE
// =========================

async function saveScore() {

    if (!playerName) {
        return;
    }


    /*
       اسم را تمیز می‌کنیم تا مثلاً:

       Ariyan
       ariyan
       Ariyan

       به خاطر فاصله یا حروف کوچک
       باعث رکوردهای بی‌دلیل نشوند.
    */

    const cleanName =
        playerName
            .trim()
            .replace(/\s+/g, " ");


    // پیدا کردن رکورد قبلی

    const { data, error } =
        await supabaseClient
            .from("scores")
            .select("id, name, score")
            .eq("name", cleanName)
            .limit(1)
            .maybeSingle();


    if (error) {

        console.error(
            "Find score error:",
            error
        );

        return;
    }


    // =========================
    // NAME ALREADY EXISTS
    // =========================

    if (data) {

        const oldScore =
            Number(data.score) || 0;


        /*
           اگر امتیاز جدید بیشتر باشد،
           همان رکورد قبلی آپدیت می‌شود.
        */

        if (score > oldScore) {

            const { error: updateError } =
                await supabaseClient
                    .from("scores")
                    .update({
                        score: score
                    })
                    .eq(
                        "id",
                        data.id
                    );


            if (updateError) {

                console.error(
                    "Update score error:",
                    updateError
                );

            }

        }


        return;
    }


    // =========================
    // NEW NAME
    // =========================

    const { error: insertError } =
        await supabaseClient
            .from("scores")
            .insert([
                {
                    name: cleanName,
                    score: score
                }
            ]);


    if (insertError) {

        console.error(
            "Insert score error:",
            insertError
        );

    }

}


// =========================
// SCORE TABLE
// =========================

scoresBtn.addEventListener(
    "click",
    loadScores
);


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
            "Load scores error:",
            error
        );


        scoreList.innerHTML =
            "❌ خطا در دریافت جدول";


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

guideBtn.addEventListener(
    "click",
    function () {

        guideModal.classList.add(
            "open"
        );

    }
);


closeGuide.addEventListener(
    "click",
    function () {

        guideModal.classList.remove(
            "open"
        );

    }
);


guideModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === guideModal
        ) {

            guideModal.classList.remove(
                "open"
            );

        }

    }
);


// =========================
// CLOSE SCORE TABLE
// =========================

closeScores.addEventListener(
    "click",
    function () {

        scoresModal.classList.remove(
            "open"
        );

    }
);


scoresModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === scoresModal
        ) {

            scoresModal.classList.remove(
                "open"
            );

        }

    }
);


// =========================
// UPDATE UI
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
// UPDATE TIME
// =========================

function updateTime() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    timeText.textContent =
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(seconds).padStart(
            2,
            "0"
        );
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
