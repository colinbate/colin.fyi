'use strict';

const MAIN_ID = 'mainBody';

function loadPage(newUrl) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState !== XMLHttpRequest.DONE) return;
    // TODO: UI for this error
    const newDocument = httpRequest.responseXML;
    if (newDocument === null) return;
    // TODO: UI for this error
    const newContent = httpRequest.responseXML.getElementById(MAIN_ID);
    if (newContent === null) return;
    document.title = newDocument.title;
    const contentElement = document.getElementById(MAIN_ID);
    contentElement.replaceWith(newContent);
  };
  httpRequest.responseType = 'document';
  httpRequest.open('GET', newUrl);
  httpRequest.send();
}

window.onload = function() {
  // Make links load asynchronously
  document.querySelector('body').addEventListener('click', event => {
    if (event.target.tagName !== 'A') return;
    // History API needed to make sure back and forward still work
    if (history === null) return;
    // External links should instead open in a new tab
    const newUrl = event.target.href;
    const domain = window.location.origin;
    if (typeof domain !== 'string' || newUrl.search(domain) !== 0) {
      event.preventDefault();
      window.open(newUrl, '_blank');
    } else {
      event.preventDefault();
      loadPage(newUrl);
      history.pushState(null /*stateObj*/, '' /*title*/, newUrl);
    }
  });
};

window.onpopstate = function(event) {
  loadPage(window.location);
};
