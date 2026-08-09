/* =====================================
   MR.YELLOW - SCRIPT
===================================== */


/* =====================================
   MENU
===================================== */

function toggleMenu() {

    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.classList.toggle("open");
}


/* =====================================
   CLOSE MENU WHEN CLICKING OUTSIDE
===================================== */

document.addEventListener("click", function (event) {

    const menu = document.getElementById("menu");
    const button = document.querySelector(".menu-btn");

    if (!menu || !button) return;

    if (
        menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !button.contains(event.target)
    ) {

        menu.classList.remove("open");

    }

});


/* =====================================
   COUNTDOWN
   10 DAYS - SAME FOR EVERYONE
===================================== */

/*
   این تاریخ برای همه کاربران یکی است.
   Refresh باعث شروع دوباره تایمر نمی‌شود.
*/

const TARGET_DATE =
    new Date("2026-08-20T00:00:00+03:30").getTime();


function updateTimer() {

    const now = Date.now();

    let remaining = TARGET_DATE - now;


    if (remaining < 0) {
        remaining = 0;
    }


    const days =
        Math.floor(
            remaining /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (remaining /
            (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (remaining /
            (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (remaining /
            1000) % 60
        );


    const daysElement =
        document.getElementById("days");


    const hoursElement =
        document.getElementById("hours");


    const minutesElement =
        document.getElementById("minutes");


    const secondsElement =
        document.getElementById("seconds");


    if (daysElement) {

        daysElement.textContent =
            String(days).padStart(2, "0");

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours).padStart(2, "0");

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds).padStart(2, "0");

    }

}


/* شروع تایمر */

updateTimer();


/* بروزرسانی هر ثانیه */

setInterval(updateTimer, 1000);


/* =====================================
   KICK LIVE STATUS
===================================== */

/*
   فعلاً وضعیت را دستی کنترل می‌کنیم.

   اگر MR.YELLOW لایو است:
       true

   اگر آفلاین است:
       false
*/

const IS_LIVE = true;


function updateStreamStatus() {

    const status =
        document.getElementById("streamStatus");


    if (!status) return;


    if (IS_LIVE === true) {

        status.classList.remove("offline");

        status.classList.add("online");

        status.textContent =
            "🟢 ONLINE";

    }

    else {

        status.classList.remove("online");

        status.classList.add("offline");

        status.textContent =
            "🔴 OFFLINE";

    }

}


/* اجرای وضعیت */

updateStreamStatus();
