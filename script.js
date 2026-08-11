function toggleMenu() {
    const menu = document.getElementById("menu");

    if (menu) {
        menu.classList.toggle("open");
    }
}


/* =========================
   TIMER
========================= */

const TARGET_DATE =
    new Date("2026-08-20T00:00:00+03:30").getTime();


function updateTimer() {

    const remaining = Math.max(
        0,
        TARGET_DATE - Date.now()
    );

    const days = Math.floor(
        remaining / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (remaining / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (remaining / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (remaining / 1000) % 60
    );


    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");


    if (d)
        d.textContent = String(days).padStart(2, "0");

    if (h)
        h.textContent = String(hours).padStart(2, "0");

    if (m)
        m.textContent = String(minutes).padStart(2, "0");

    if (s)
        s.textContent = String(seconds).padStart(2, "0");
}


updateTimer();

setInterval(updateTimer, 1000);


/* =========================
   KICK STATUS
========================= */

/*
   فعلاً ONLINE ثابت است تا API
   باعث OFFLINE اشتباه نشود.
*/
