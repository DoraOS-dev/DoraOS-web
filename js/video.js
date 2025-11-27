// Video linkovi

function loadVideoLinks() {
    try {
        const raw = localStorage.getItem("dora_video");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveVideoLinks(data) {
    localStorage.setItem("dora_video", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    const linkDarko = document.getElementById("linkDarko");
    const linkPatricia = document.getElementById("linkPatricia");
    const btnSave = document.getElementById("btnSaveVideo");
    const lblSaved = document.getElementById("videoSaved");
    const btnCallDarko = document.getElementById("btnCallDarko");
    const btnCallPatricia = document.getElementById("btnCallPatricia");

    const data = loadVideoLinks();
    if (linkDarko && data.darko) linkDarko.value = data.darko;
    if (linkPatricia && data.patricia) linkPatricia.value = data.patricia;

    btnSave?.addEventListener("click", () => {
        saveVideoLinks({
            darko: linkDarko?.value || "",
            patricia: linkPatricia?.value || ""
        });
        if (lblSaved) {
            lblSaved.textContent = "Linkovi su spremljeni.";
            setTimeout(() => (lblSaved.textContent = ""), 2500);
        }
    });

    btnCallDarko?.addEventListener("click", () => {
        if (linkDarko && linkDarko.value) {
            window.open(linkDarko.value, "_blank");
        } else {
            alert("Prvo upišite link za poziv s Darkom.");
        }
    });

    btnCallPatricia?.addEventListener("click", () => {
        if (linkPatricia && linkPatricia.value) {
            window.open(linkPatricia.value, "_blank");
        } else {
            alert("Prvo upišite link za poziv s djecom.");
        }
    });
});
