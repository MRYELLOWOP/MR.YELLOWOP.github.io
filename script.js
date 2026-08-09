/* =========================
   MENU
========================= */

function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu) menu.classList.toggle("open");
}


/* =========================
   TIMER - SHARED FOR EVERYONE
========================= */

// زمان پایان مشترک برای همه کاربران
// این تاریخ را بعداً فقط یک بار تغییر می‌دهیم.
const TARGET_DATE = new Date("2026-08-20T00:00:00+03:30").getTime();


function updateTimer() {

    const remaining = Math.max(0, TARGET_DATE - Date.now());

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

    if (d) d.textContent = String(days).padStart(2, "0");
    if (h) h.textContent = String(hours).padStart(2, "0");
    if (m) m.textContent = String(minutes).padStart(2, "0");
    if (s) s.textContent = String(seconds).padStart(2, "0");
}

updateTimer();
setInterval(updateTimer, 1000);


/* =========================
   KICK STATUS
========================= */

async function checkKickStatus() {

    const status = document.getElementById("streamStatus");

    if (!status) return;

    try {

        /*
         * وضعیت کانال mryellowop
         * از سرویس واسط عمومی خوانده می‌شود.
         */

        const response = await fetch(
            "https://kick.com/api/v2/channels/mryellowop",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Kick request failed");
        }

        const data = await response.json();

        const live =
            data &&
            data.livestream !== null &&
            data.livestream !== undefined;


        if (live) {

            status.className = "status online";
            status.textContent = "🟢 ONLINE";

        } else {

            status.className = "status offline";
            status.textContent = "🔴 OFFLINE";

        }

    } catch (error) {

        /*
         * اگر Kick پاسخ نداد،
         * سایت خراب نمی‌شود.
         */

        status.className = "status offline";
        status.textContent = "🔴 OFFLINE";

        console.log("Kick status error:", error);

    }
}


checkKickStatus();

// هر 60 ثانیه دوباره بررسی می‌کند
setInterval(checkKickStatus, 60000);
