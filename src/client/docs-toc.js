const anchors = document.querySelectorAll("a.header-anchor");
const tocLinks = document.querySelectorAll("#toc-container a");

var contentContainer = document.querySelector(".docs-wrapper");
contentContainer.onscroll = function (ev) {
  // check if the anchor elements are visible

  for (let index = 0; index < anchors.length; index++) {
    const el = anchors[index];
    if (isElementInViewport(el, 70, 500)) {
      // update the URL hash
      if (window.history.pushState) {
        var urlHash = el.hash;
        window.history.pushState(null, null, urlHash);

        /* Highlight toc */
        highlightTOC(el.hash);
        return;
      }
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
function isElementInViewport(el, offsetTop = 0, offsetBottom = 0) {
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
