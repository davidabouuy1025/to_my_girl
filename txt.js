// Edit here ↓↓↓
const texts = [
    "> ...",
    "> print(who_birthday == today)",
    "> loading ...",
    "> searching ...",
    "",
    "It's KEXIN's bday!! 🎉🎉"
];

const output = document.getElementById("output");

// Helper to pause
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runFirstScript() {
    output.innerHTML = ""; // clear previous text
    for (let i = 0; i < texts.length; i++) {
        output.innerHTML += texts[i] + "<br>";
        await wait(1500); // wait 1 second between lines
    }

    // Trigger confetti at the end
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.8 } });
    await wait(500);
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    await wait(400);
    confetti({ particleCount: 150, spread: 50, origin: { y: 0.5 } });
    await wait(3000)

    window.location.href = "bday.html";

    // Replace current page in history (cannot go back)
    // window.location.replace("bday.html");

    // Reload current page
    // window.location.reload();
}

// Start
runFirstScript();
