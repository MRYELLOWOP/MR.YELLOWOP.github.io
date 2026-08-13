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

let gameTimer = null;


// =========================
// SPEED
// =========================

// سرعت ثابت بازی
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


    if (playerName === "") {

        message.textContent =
            "⚠️ اول اسمت رو وارد کن";

        playerNameInput.focus();

        return;
    }


    // مقدارهای اولیه بازی

    score = 0;

    lives = 3;

    timeLeft = 180;

    running = true;


    // تایمرهای قبلی را پاک کن

    clearInterval(moveTimer);

    clearInterval(gameTimer);


    startBtn.disabled = true;

    startBtn.textContent =
        "🎮 بازی در حال اجرا";


    message.textContent =
        "🎯 شروع شد!";


    updateUI();


    // اولین هدف

    showTarget();


    // حرکت هدف با سرعت ثابت

    moveTimer =
        setInterval(
            showTarget,
            GAME_SPEED
        );


    // تایمر ۳ دقیقه‌ای

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


    const randomIndex =
        Math.floor(
            Math.random() * holes.length
        );


    currentHole =
        holes[randomIndex];


    const image =
        document.createElement("img");


    /*
        35 درصد دماغ
        65 درصد فتاح
    */

    if (Math.random() < 0.35) {

        currentType =
            "bomb";

        image.src =
            "bomb.png";

        image.alt =
            "دماغ";

    }

    else {

        currentType =
            "target";

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
// HOLE CLICK
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


                // =====================
                // NOSE
                // =====================

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

                        return;

                    }

                }


                // =====================
                // FATAH
                // =====================

                else {

                    score++;


                    message.textContent =
                        "🔥 آفرین!";


                    updateUI();


                    clearBoard();

                }

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


    // =====================
    // LOST ALL LIVES
    // =====================

    if (lostAllLives) {

        startBtn.disabled = false;

        startBtn.textContent =
            "🔄 دوباره بازی کن";


        message.textContent =
            "💥 باختی! امتیازت: " +
            score;

    }


    // =====================
    // TIME OVER
    // =====================

    else {

        startBtn.disabled = false;

        startBtn.textContent =
            "🔄 دوباره بازی کن";


        message.textContent =
            "⏱️ زمان تمام شد! امتیازت: " +
            score;

    }


    // ذخیره رکورد

    await saveScore();

}


// =========================
// SAVE / UPDATE SCORE
// =========================

async function saveScore() {

    if (!playerName) {
        return;
    }


    // اول ببینیم این اسم قبلاً وجود دارد یا نه

    const { data: oldPlayer, error: findError } =
        await supabaseClient
            .from("scores")
            .select("name, score")
            .eq("name", playerName)
            .maybeSingle();


    if (findError) {

        console.error(
            "Find player error:",
            findError
        );

        return;
    }


    // =====================
    // PLAYER EXISTS
    // =====================

    if (oldPlayer) {

        const oldScore =
            Number(oldPlayer.score) || 0;


        // اگر رکورد جدید بهتر نیست
        // همان رکورد قبلی باقی بماند

        if (score <= oldScore) {

            return;
        }


        // رکورد بهتر شده
        // فقط امتیاز را آپدیت کن

        const { error: updateError } =
            await supabaseClient
                .from("scores")
                .update({
                    score: score
                })
                .eq(
                    "name",
                    playerName
                );


        if (updateError) {

            console.error(
                "Update score error:",
                updateError
            );

        }


        return;
    }


    // =====================
    // NEW PLAYER
    // =====================

    const { error: insertError } =
        await supabaseClient
            .from("scores")
            .insert([
                {
                    name: playerName,
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


// بستن راهنما با کلیک بیرون

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


// بستن جدول با کلیک بیرون

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
