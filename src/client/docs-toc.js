const anchors = document.querySelectorAll("a.header-anchor");
const tocLinks = document.querySelectorAll("#toc-container a");
var docsWrapper = document.querySelector(".docs-wrapper");
var contentContainer = document.querySelector(".docs-content");
let activeElement = null;
let previousElement = null;
var remBase = parseInt(
  window.getComputedStyle(document.body).getPropertyValue("font-size"),
  10
);

docsWrapper.onscroll = function (ev) {
  // check if the anchor elements are visible
  //   console.log(contentContainer.scrollTop);

  for (let index = 0; index < anchors.length; index++) {
    const el = anchors[index];

    // if (el.offsetTop > el.offsetParent.scrollTop - 50) {
    if (isElementInViewport(el, 3.5 * remBase, 8 * remBase)) {
      // update the URL hash

      /* Highlight toc */
      highlightTOC(el.hash);
      return;
    } else if (isElementInViewport(el, 5 * remBase) && index > 0) {
      highlightTOC(anchors[index - 1].hash);
      return;
    }
  }
};

/**
 * Highlight current section on table of contents.
 * @param {*} hash
 */
function highlightTOC(hash) {
  /* First unhighlight current */
  const oldEl = document.querySelector("#toc-container a.active");
  if (oldEl) oldEl.classList.remove("active");

  for (let index = 0; index < tocLinks.length; index++) {
    const el = tocLinks[index];
    if (el.hash === hash) {
      el.classList.add("active");
      return;
    }

    // const el = [...tocLinks].filter((f) => f.hash === hash);
    // if (el) {
    //   el.classList.add("active");
    // }
  }
}

// Source: http://stackoverflow.com/questions/30734552/change-url-while-scrolling
// stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(
  el,
  offsetTop = 0,
  offsetBottom = window.innerHeight
) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= offsetTop &&
    rect.left >= 0 &&
    rect.bottom <= offsetBottom &&
    //   (window.innerHeight ||
    //     document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /*or $(window).width() */
  );
}
