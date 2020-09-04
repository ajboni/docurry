var curScriptElement = document.currentScript;
var lang = null;
var searchIndex = null;
var idx = null;

window.onload = async function () {
  lang = curScriptElement.dataset.lang;
  await loadSearchDatabase();
};

/* Loads the Search Database */
async function loadSearchDatabase() {
  try {
    const dbPath = `/${lang}/searchIndex.json`;
    const response = await fetch(dbPath);
    const json = await response.json();
    searchIndex = json;
  } catch (error) {
    console.error(error);
  }

  /* Setup Lunr */
  idx = lunr.Index.load(searchIndex);
}

/**
 * Perform a full site search
 *
 * @param {*} str
 */
function search(str) {
  const results = idx.search(str);
  return results;
}
