/**
 * Copyright (C) 2020 Alexis Boni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const anchors = document.querySelectorAll("a.header-anchor");
const tocLinks = document.querySelectorAll("#toc-container a");
var docsWrapper = document.querySelector(".docs-wrapper");
var contentContainer = document.querySelector(".docs-content");
var remBase = parseInt(
  window.getComputedStyle(document.body).getPropertyValue("font-size"),
  10
);

docsWrapper.onscroll = function (ev) {
  // check if the anchor elements are visible

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
