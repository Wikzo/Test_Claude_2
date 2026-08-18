const TAG_LABELS = {
  population: "Population",
  sightings: "Sightings & Safety",
  livestock: "Livestock & Conflict",
  policy: "Management & Policy"
};

function formatDate(value) {
  const parsed = new Date(value);
  if (isNaN(parsed) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function articleCard(article) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.tags = article.tags.join(",");
  card.dataset.search = (article.title + " " + article.summary + " " + article.source).toLowerCase();

  const tagsHtml = article.tags
    .map(t => `<span class="chip chip-${t}">${TAG_LABELS[t] || t}</span>`)
    .join("");

  card.innerHTML = `
    <div class="card-meta">
      <span class="source">${article.source}</span>
      <span class="date">${formatDate(article.date)}</span>
    </div>
    <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
    <p class="summary">${article.summary}</p>
    <div class="card-footer">
      <div class="chips">${tagsHtml}</div>
      <a class="read-more" href="${article.url}" target="_blank" rel="noopener noreferrer">Read article →</a>
    </div>
  `;
  return card;
}

function render(articles) {
  const container = document.getElementById("articles");
  container.innerHTML = "";
  articles.forEach(a => container.appendChild(articleCard(a)));
  document.getElementById("emptyState").hidden = articles.length !== 0;
}

function applyFilters() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const tag = document.getElementById("tagFilter").value;

  const filtered = ARTICLES.filter(article => {
    const matchesTag = tag === "all" || article.tags.includes(tag);
    const matchesQuery = !query ||
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query);
    return matchesTag && matchesQuery;
  });

  render(filtered);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("tagFilter").addEventListener("change", applyFilters);

render(ARTICLES);
