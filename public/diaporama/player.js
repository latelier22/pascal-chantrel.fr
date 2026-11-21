(function () {
  "use strict";
  var screen = document.getElementById("screen");
  var empty = document.getElementById("empty");
  var button = document.getElementById("fullscreen");
  var orientation = document.body.getAttribute("data-orientation");
  var list = [];
  var content;
  var index = 0;
  var generation = 0;
  var timer;
  var hideButton;
  var visible;
  var preload;

  function schedule(fn, delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  }

  function addText(parent, tag, name, text) {
    var element = document.createElement(tag);
    element.className = name;
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function imageSlide(slide) {
    var element = document.createElement("div");
    element.className = "slide";
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", slide.title || "Visuel du magasin");
    element.style.backgroundImage = 'url("' + slide.url + '")';
    return element;
  }

  function productSlide(slide, image) {
    var element = document.createElement("article");
    element.className = "slide christmas-slide";
    var content = addText(element, "div", "christmas-content", "");
    var brand = addText(content, "p", "christmas-brand", "Pascal Chantrel");
    addText(brand, "span", "christmas-label", "Sélection de Noël");

    var photo = addText(content, "div", "christmas-photo", "");
    image.alt = "";
    photo.appendChild(image);

    var copy = addText(content, "div", "christmas-copy", "");
    addText(copy, "p", "christmas-category", slide.category);
    addText(copy, "h1", "christmas-title", slide.title);
    addText(copy, "p", "christmas-reference", slide.reference);
    if (slide.feature || slide.energy) {
      var traits = addText(copy, "ul", "christmas-traits", "");
      if (slide.feature) addText(traits, "li", "", slide.feature);
      if (slide.energy) addText(traits, "li", "", slide.energy);
    }
    addText(copy, "p", "christmas-price", slide.price);

    var progress = addText(element, "div", "christmas-progress", "");
    progress.setAttribute("aria-hidden", "true");
    progress.style.animationDuration = slide.duration + "s";
    return element;
  }

  function show(position, remaining) {
    var slide = list[position];
    var ticket = ++generation;
    var image = new Image();
    var loading;

    function failed() {
      if (ticket !== generation) return;
      generation++;
      window.clearTimeout(loading);
      if (remaining > 1) {
        show((position + 1) % list.length, remaining - 1);
      } else {
        schedule(function () { show(position, list.length); }, 5000);
      }
    }

    image.onload = function () {
      if (ticket !== generation) return;
      window.clearTimeout(loading);
      var element = slide.kind === "product" ? productSlide(slide, image) : imageSlide(slide);
      screen.appendChild(element);
      if (visible) screen.removeChild(visible);
      visible = element;
      empty.style.display = "none";
      index = position;
      if (list.length > 1) {
        var next = (index + 1) % list.length;
        preload = new Image();
        preload.src = list[next].url;
        schedule(function () { show(next, list.length); }, slide.duration * 1000);
      }
    };
    image.onerror = failed;
    loading = window.setTimeout(failed, 9000);
    image.src = slide.url;
  }

  function refresh() {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/diaporama?orientation=" + orientation);
    request.timeout = 9000;
    request.onload = function () {
      try {
        if (request.status !== 200) return;
        var playlist = JSON.parse(request.responseText);
        var nextContent = JSON.stringify(playlist.slides);
        if (nextContent === content) return;
        content = nextContent;
        list = playlist.slides;
        generation++;
        window.clearTimeout(timer);
        if (list.length) {
          show(0, list.length);
        } else {
          if (visible) screen.removeChild(visible);
          visible = null;
          empty.style.display = "block";
        }
      } catch (error) {
        // Conserver le dernier visuel lors d'une coupure ou d'une réponse invalide.
      }
    };
    request.onloadend = function () { window.setTimeout(refresh, 10000); };
    request.send();
  }

  function showButton() {
    button.className = "";
    window.clearTimeout(hideButton);
    hideButton = window.setTimeout(function () { button.className = "hidden"; }, 4500);
  }

  var fullscreen = screen.requestFullscreen || screen.webkitRequestFullscreen;
  if (fullscreen) {
    button.onclick = function () {
      var result = fullscreen.call(screen);
      if (result && typeof result.catch === "function") result.catch(function () {});
    };
    document.addEventListener("mousemove", showButton);
    document.addEventListener("keydown", showButton);
    showButton();
  } else {
    button.style.display = "none";
  }

  refresh();
})();
