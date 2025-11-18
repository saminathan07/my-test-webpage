// ---------- CONFIG ----------
/*
 If you want Formspree (no-backend) set FORMSPREE_ID to your id (example: 'xbjqwzrl')
 Steps: sign up at https://formspree.io, create a form -> you'll get an ID like /f/ID
 If left blank, the code will fallback to mailto: behavior.
*/
const FORMSPREE_ID = ""; // <-- put your Formspree ID here (only the ID part, not full URL)
const CONTACT_EMAIL = "saminathanviviv15promail@example.com"; // <-- replace with your real email

// ---------- Data ----------
const PROJECTS = [
  { title: "Online Food Order", desc: "Food ordering web app.", tags: ["web"], live: "#", repo: "#" },
  { title: "Docker Monitor", desc: "Monitor containers and alerts.", tags: ["tools"], live: "#", repo: "#" },
  { title: "Image Classifier", desc: "AI image recognition project.", tags: ["ml"], live: "#", repo: "#" },
];

// ---------- Elements ----------
const grid = document.getElementById("projectsGrid");
const projCount = document.getElementById("projCount");
const modalBack = document.getElementById("modalBack");
const sendBtn = document.getElementById("sendBtn");
const sendStatus = document.getElementById("sendStatus");
const contactForm = document.getElementById("contactForm");

// ---------- Render ----------
function render(filter = "all") {
  grid.innerHTML = "";
  const list = PROJECTS.filter(p => filter === "all" || p.tags.includes(filter));
  projCount.textContent = list.length;
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "proj";
    div.innerHTML = `<h3>${p.title}</h3><p style="color:var(--muted);margin:6px 0">${p.desc}</p>
      <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`;
    div.onclick = () => openModal(p);
    grid.appendChild(div);
  });
}
render();

// ---------- Filters ----------
document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#filterBar .btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.filter);
});

// ---------- Modal ----------
function openModal(p) {
  document.getElementById("mTitle").textContent = p.title;
  document.getElementById("mDesc").textContent = p.desc;
  document.getElementById("mLinks").innerHTML = `
    <a class="btn" href="${p.live}" target="_blank">Live</a>
    <a class="btn" href="${p.repo}" target="_blank">Repo</a>`;
  modalBack.classList.add("show");
  modalBack.setAttribute("aria-hidden","false");
}
document.getElementById("closeModal").onclick = () => {
  modalBack.classList.remove("show");
  modalBack.setAttribute("aria-hidden","true");
};
modalBack.addEventListener("click", e => { if (e.target === modalBack) { modalBack.classList.remove("show"); modalBack.setAttribute("aria-hidden","true"); } });

// ---------- Theme toggle ----------
document.getElementById("themeToggle").addEventListener("click", () => {
  const el = document.body;
  const next = el.getAttribute("data-theme") === "dark" ? "light" : "dark";
  el.setAttribute("data-theme", next);
});

// ---------- Copy email ----------
document.getElementById("copyEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    alert("Email copied: " + CONTACT_EMAIL);
  } catch (e) {
    prompt("Copy this email:", CONTACT_EMAIL);
  }
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Contact send (Formspree fallback to mailto) ----------
async function sendContact() {
  const nameEl = document.getElementById("cname");
  const emailEl = document.getElementById("cemail");
  const msgEl = document.getElementById("cmsg");

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const msg = msgEl.value.trim();

  if (!name || !email || !msg) {
    alert("Please fill all fields.");
    return;
  }

  // UI feedback
  sendBtn.disabled = true;
  sendStatus.style.display = "inline";
  sendStatus.textContent = "Sending…";

  // If user configured Formspree
  if (FORMSPREE_ID && FORMSPREE_ID.trim() !== "") {
    try {
      const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
      const payload = {
        name,
        _replyto: email,
        message: msg
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        sendStatus.textContent = "Message sent — thank you!";
        contactForm.reset();
      } else {
        // fallback to mailto if Formspree fails
        sendStatus.textContent = "Form service error — opening mail client...";
        fallbackMailto(name, email, msg);
      }
    } catch (err) {
      sendStatus.textContent = "Network error — opening mail client...";
      fallbackMailto(name, email, msg);
    } finally {
      setTimeout(() => { sendBtn.disabled = false; sendStatus.style.display = "none"; }, 1600);
    }
    return;
  }

  // No Formspree ID set -> fallback to mailto:
  fallbackMailto(name, email, msg);
  setTimeout(() => { sendBtn.disabled = false; sendStatus.style.display = "none"; }, 1400);
}

function fallbackMailto(name, email, msg) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
