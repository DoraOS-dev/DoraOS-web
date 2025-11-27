document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("video-notes");
  const btn = document.getElementById("save-video-notes");

  const raw = localStorage.getItem("dora_video_notes");
  if (raw) textarea.value = raw;

  btn.addEventListener("click", () => {
    localStorage.setItem("dora_video_notes", textarea.value);
    btn.textContent = "Spremljeno ✔";
    setTimeout(() => (btn.textContent = "Spremi upute"), 1500);
  });
});
