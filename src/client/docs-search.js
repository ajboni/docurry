var curScriptElement = document.currentScript;
var lang = null;
var searchIndex = null;
var searchDatabase = null;
var fuse = null;
var noSearchResultText = "No Results.";

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
  noSearchResultText = curScriptElement.dataset.no_search_result;
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
    // minMatchCharLength: 3,
    // ignoreFieldNorm: true,
    keys: [
      { name: "plainTextContent", weight: 1 },
      { name: "title", weight: 2 },
      { name: "url", weight: 0.5 },
    ],
    sortFn: function (a, b) {
      if (b.matches[0].indices.length > a.matches[0].indices.length) {
        return 1;
      }
      return 0;
    },
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

  if (str.length <= 2) {
    dropdown.style.display = "none";
    return;
  }

  const results = fuse.search(`'${str}`);

  if (!results.length) {
    const el = document.createElement("div");

    el.className = "search-result";
    const text = document.createElement("div");
    text.className = "search-result-text";
    text.innerHTML = `${noSearchResultText}`;
    el.appendChild(text);

    dropdown.appendChild(el);
  } else {
    results.forEach((res) => {
      const el = document.createElement("div");

      el.className = "search-result";

      const title = document.createElement("a");
      title.className = "search-result-title";
      title.innerHTML = `${res.item.title}`;
      title.href = res.item.url;

      const text = document.createElement("a");
      text.href = res.item.url;
      text.className = "search-result-text";

      const matches = res.matches;
      matches.forEach((match) => {
        const maxCharacters = 100;
        const startIndex = match.indices[0][0] - maxCharacters;
        const endIndex =
          match.indices[match.indices.length - 1][1] + maxCharacters;
        let result = match.value.substring(startIndex, endIndex);

        match.indices.forEach((index) => {
          const keyword = match.value.substring(index[0], index[1] + 1);
          result = result.replaceAll(
            keyword,
            `<span class='search-result-keyword'>${keyword}</span>`
          );
        });

        if (match.key === "title") {
          title.innerHTML = result;
        } else {
          text.innerHTML += result;
        }
      });

      el.appendChild(title);
      el.appendChild(text);
      dropdown.appendChild(el);
    });
  }

  dropdown.style.display = "block";
  console.log(results);
  return results;
}

/* Delay execution of function */
function delay(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}
