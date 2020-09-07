var curScriptElement = document.currentScript;
var lang = null;
var searchIndex = null;
var searchDatabase = null;
var fuse = null;

/* Hide popup */
var container = document.getElementById("docs-search-dropdown-menu");
document.onclick = function (e) {
  //   console.log(e.target.closest("#docs-search-dropdown-menu"));
  if (!e.target.closest("#docs-search-dropdown-menu")) {
    container.style.display = "none";
  }
};

window.onload = async function () {
  lang = curScriptElement.dataset.lang;
  await loadSearchIndex();
  await loadSearchDatabase();
  const searchInput = window.document.getElementById("docs-search-input");
  searchInput.onkeyup = delay((e) => {
    search(searchInput.value);
  }, 750);

  const searchDropdown = document.getElementById("docs-search-dropdown-menu");
  searchDropdown.onblur = () => (searchDropdown.style.display = "none");
};

/* Loads the Search Database */
async function loadSearchIndex() {
  try {
    const indexPath = `/${lang}/searchIndex.json`;
    const response = await fetch(indexPath);
    const json = await response.json();
    searchIndex = json;
  } catch (error) {
    console.error(error);
  }
}

/* Loads the Search Database */
async function loadSearchDatabase() {
  try {
    const indexPath = `/${lang}/searchDatabase.json`;
    const response = await fetch(indexPath);
    const json = await response.json();
    searchDatabase = json;
  } catch (error) {
    console.error(error);
  }

  /* Setup Fuse */
  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    // ignoreFieldNorm: true,
    keys: [
      { name: "plainTextContent", weight: 1 },
      { name: "title", weight: 2 },
      { name: "url", weight: 0.5 },
    ],
  };
  const fuseIndex = Fuse.parseIndex(searchIndex);
  fuse = new Fuse(searchDatabase, fuseOptions, fuseIndex);
}

/**
 * Perform a full site search
 *
 * @param {*} str
 */
function search(str) {
  const dropdown = document.getElementById("docs-search-dropdown-menu");
  dropdown.innerHTML = "";

  if (str === "" || str === "") {
    dropdown.style.display = "none";
    return;
  }

  const results = fuse.search(`'${str}`);

  if (!results.length) {
    const el = document.createElement("div");

    el.innerHTML = "<p>No results</p>";
    dropdown.appendChild(el);
  } else {
    results.forEach((res) => {
      const el = document.createElement("div");

      el.className = "search-result";

      const title = document.createElement("a");
      title.className = "search-result-title";
      title.innerHTML = `${res.item.title}`;
      title.href = res.item.url;

      //   const url = document.createElement("div");
      //   url.className = "search-result-url";
      //   url.innerHTML = res.item.url;

      const text = document.createElement("a");
      text.href = res.item.url;
      text.className = "search-result-text";
      let textHTML = "";
      let titleHTML = "";

      const matches = res.matches;
      matches.forEach((match) => {
        match.indices.forEach((index) => {
          const maxCharacters = 100;
          let result = "";

          if (
            match.value.substring(
              index[0] - maxCharacters - 2,
              index[0] - maxCharacters - 1
            ).length > 0
          ) {
            result += "...";
          }

          result +=
            match.value
              .substring(index[0] - maxCharacters, index[0])
              .replace("\n", "") +
            "<span class='search-result-keyword'>" +
            match.value.substring(index[0], index[1] + 1) +
            "</span>" +
            match.value.substring(index[1] + 1, index[1] + maxCharacters);

          if (
            match.value.substring(
              index[0] + maxCharacters + 1,
              index[0] + maxCharacters + 2
            ).length > 0
          )
            result += "...";
          result += "<br/>";

          if (match.key === "title") {
            titleHTML += result.replace("\n", "<br><br>");
          } else {
            textHTML += result.replace("\n", "<br><br>");
          }
        });
      });

      text.innerHTML = textHTML;
      if (titleHTML !== "") title.innerHTML = titleHTML;

      el.appendChild(title);
      //   el.appendChild(url);
      el.appendChild(text);
      dropdown.appendChild(el);
    });
  }

  dropdown.style.display = "block";

  console.log(results);
  return results;
}

function delay(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}
