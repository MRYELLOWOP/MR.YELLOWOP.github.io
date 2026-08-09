/* =========================
   MENU
========================= */

function toggleMenu() {

    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.classList.toggle("open");
}


/* بستن منو با کلیک روی لینک */

document.addEventListener("click", function(event) {

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


/* =========================
   TIMER
========================= */

/*
   این تاریخ برای همه کاربران یکی است.

   شروع: 10 روز
   پایان: 20 August 2026 - 00:00
*/

const targetDate =
    new Date("2026-08-20T00:00:00+03:30").getTime();


function updateTimer() {

    const now = Date.now();

    let difference = targetDate - now;


    if (difference <= 0) {

        difference = 0;

    }


    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (difference / (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (difference / 1000) % 60
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


updateTimer();

setInterval(updateTimer, 1000);


/* =========================
   KICK STATUS
========================= */

/*
   فعلاً وضعیت را دستی کنترل می‌کنیم
   تا چیزی خراب یا وابسته به API خارجی نباشد.

   وقتی لایو شد:
   true

   وقتی آفلاین شد:
   false
*/

const isLive = false;


function updateStreamStatus() {

    const status =
        document.getElementById("streamStatus");


    if (!status) return;


    if (isLive) {

        status.classList.remove("offline");

        status.classList.add("online");

        status.textContent = "🟢 ONLINE";

    } else {

        status.classList.remove("online");

        status.classList.add("offline");

        status.textContent = "🔴 OFFLINE";

    }

}


updateStreamStatus();
