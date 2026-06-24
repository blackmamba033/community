/* Loads businesses.json and renders the roster with live search + category filter.
   Categories are derived from the data, so adding a new one in the JSON
   automatically creates its filter chip. No build step, no dependencies. */

const state = { all: [], filtered: [], category: "All", query: "" };

const els = {
  roster: document.getElementById("roster"),
  chips: document.getElementById("chips"),
  search: document.getElementById("search"),
  count: document.getElementById("resultcount"),
  stat_listings: document.getElementById("stat-listings"),
  stat_categories: document.getElementById("stat-categories"),
};

init();

async function init() {
  try {
    const res = await fetch("businesses.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    state.all = (data.businesses || []).slice().sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (err) {
    els.roster.innerHTML =
      `<div class="empty"><strong>Couldn't load the directory</strong>
       Make sure businesses.json sits next to this page. If you're previewing
       by double-clicking the file, run it through a local server or push it to
       GitHub Pages — browsers block file loading from disk.</div>`;
    return;
  }

  buildChips();
  bindSearch();
  apply();

  if (els.stat_listings) els.stat_listings.textContent = state.all.length;
  if (els.stat_categories)
    els.stat_categories.textContent = categories().length;
}

function categories() {
  return [...new Set(state.all.map((b) => b.category).filter(Boolean))].sort();
}

function buildChips() {
  const cats = ["All", ...categories()];
  els.chips.innerHTML = cats
    .map((c) => {
      const pressed = c === state.category;
      const allClass = c === "All" ? " all" : "";
      return `<button class="chip${allClass}" role="button"
                aria-pressed="${pressed}" data-cat="${escapeAttr(c)}">${escapeHtml(
        c
      )}</button>`;
    })
    .join("");

  els.chips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.cat;
      els.chips
        .querySelectorAll(".chip")
        .forEach((c) =>
          c.setAttribute("aria-pressed", String(c === chip))
        );
      apply();
    });
  });
}

function bindSearch() {
  els.search.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    apply();
  });
}

function apply() {
  const q = state.query;
  state.filtered = state.all.filter((b) => {
    const catOk = state.category === "All" || b.category === state.category;
    if (!catOk) return false;
    if (!q) return true;
    const hay = [b.name, b.category, b.owner, b.blurb, b.suburb]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
  render();
}

function render() {
  const n = state.filtered.length;
  els.count.textContent =
    n === 0
      ? "No matches"
      : `${n} ${n === 1 ? "listing" : "listings"}` +
        (state.category !== "All" ? ` · ${state.category}` : "") +
        (state.query ? ` · "${state.query}"` : "");

  if (n === 0) {
    els.roster.innerHTML = `<div class="empty">
      <strong>No one on the bench for that</strong>
      Try a different category, or clear your search. If you run a business that
      belongs here, <a href="list-your-business.html">claim a spot</a>.</div>`;
    return;
  }

  els.roster.innerHTML = state.filtered.map(card).join("");
}

function card(b) {
  const phone = b.phone
    ? `<div class="row"><span class="k">Phone</span><a href="tel:${escapeAttr(
        b.phone.replace(/\s+/g, "")
      )}">${escapeHtml(b.phone)}</a></div>`
    : "";
  const email = b.email
    ? `<div class="row"><span class="k">Email</span><a href="mailto:${escapeAttr(
        b.email
      )}">${escapeHtml(b.email)}</a></div>`
    : "";
  const web = b.website
    ? `<div class="row"><span class="k">Web</span><a href="${escapeAttr(
        b.website
      )}" target="_blank" rel="noopener">${escapeHtml(
        prettyUrl(b.website)
      )}</a></div>`
    : "";
  const suburb = b.suburb
    ? `<div class="row"><span class="k">Area</span>${escapeHtml(b.suburb)}</div>`
    : "";
  const since = b.member_since
    ? ` · Member since ${escapeHtml(String(b.member_since))}`
    : "";

  return `<article class="card">
    <div class="head">
      <div class="jersey">
        <span class="hash">NO.</span>
        <span class="no">${b.member_no != null ? escapeHtml(String(b.member_no)) : "—"}</span>
      </div>
      <div class="who">
        <span class="pos">${escapeHtml(b.category || "Member")}</span>
        <h3>${escapeHtml(b.name)}</h3>
      </div>
    </div>
    <div class="body">
      <div class="owner">${escapeHtml(b.owner || "")}${since}</div>
      <p class="blurb">${escapeHtml(b.blurb || "")}</p>
      <div class="meta">${suburb}${phone}${email}${web}</div>
    </div>
  </article>`;
}

function prettyUrl(u) {
  return u.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function escapeAttr(s) {
  return escapeHtml(s);
}
