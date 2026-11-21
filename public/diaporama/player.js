(function () {
  "use strict";
  var screen = document.getElementById("screen");
  var empty = document.getElementById("empty");
  var button = document.getElementById("fullscreen");
  var orientation = document.body.getAttribute("data-orientation");
  var selection = /(?:^|[?&])diapo=([a-z0-9-]+)(?:&|$)/.exec(window.location.search);
  var list = [];
  var content;
  var index = 0;
  var generation = 0;
  var timer;
  var hideButton;
  var visible;
  var preload;
  var retiring;
  var transitionTimer;
  var transitions = orientation === "vertical" ? ["top", "bottom"] : ["left", "right", "top", "bottom"];
  var displayCount = 0;

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
    element.className = "slide image-slide";
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", slide.title || "Visuel du magasin");
    element.style.backgroundImage = 'url("' + slide.url + '")';
    return element;
  }

  function christmasLights(parent) {
    var lights = addText(parent, "div", "christmas-lights", "");
    lights.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 12; i++) {
      addText(lights, "span", "christmas-star", i % 3 === 0 ? "✧" : "✦");
    }
  }

  function productSlide(slide, image, layout) {
    var element = document.createElement("article");
    element.className = "slide christmas-slide" + (slide.theme === "standard" ? " standard-slide" : "");
    element.setAttribute("data-layout", layout);
    if (slide.theme !== "standard") christmasLights(element);
    var content = addText(element, "div", "christmas-content", "");
    var brand = addText(content, "p", "christmas-brand", "Pascal Chantrel");
    addText(brand, "span", "christmas-label", slide.heading || "Sélection de Noël");

    var photo = addText(content, "div", "christmas-photo", "");
    if (image) {
      image.alt = "";
      photo.appendChild(image);
    } else {
      addText(photo, "p", "product-no-photo", "Photo à venir");
    }

    var copy = addText(content, "div", "christmas-copy", "");
    var details = addText(copy, "div", "christmas-details", "");
    addText(details, "p", "christmas-category", slide.category);
    addText(details, "h1", "christmas-title", slide.title);
    addText(details, "p", "christmas-reference", slide.reference);
    if (slide.feature || slide.energy) {
      var traits = addText(details, "ul", "christmas-traits", "");
      if (slide.feature) addText(traits, "li", "", slide.feature);
      if (slide.energy) addText(traits, "li", "", slide.energy);
    }
    var price = addText(copy, "p", "christmas-price", slide.price);
    if (slide.price.indexOf("€") === -1) price.className += " price-on-request";

    var progress = addText(element, "div", "christmas-progress", "");
    progress.setAttribute("aria-hidden", "true");
    progress.style.animationDuration = slide.duration + "s";
    return element;
  }

  function removeRetiring() {
    window.clearTimeout(transitionTimer);
    if (retiring) screen.removeChild(retiring);
    retiring = null;
  }

  function replaceVisible(element) {
    removeRetiring();
    screen.appendChild(element);
    if (visible) {
      retiring = visible;
      retiring.setAttribute("aria-hidden", "true");
      transitionTimer = window.setTimeout(removeRetiring, 760);
    }
    visible = element;
    empty.style.display = "none";
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

    function display(loaded) {
      if (ticket !== generation) return;
      window.clearTimeout(loading);
      var element;
      if (slide.kind === "product") {
        element = productSlide(slide, loaded, transitions[displayCount % transitions.length]);
        displayCount++;
      } else {
        element = imageSlide(slide);
      }
      replaceVisible(element);
      index = position;
      if (list.length > 1) {
        var next = (index + 1) % list.length;
        if (list[next].url) {
          preload = new Image();
          preload.src = list[next].url;
        }
        schedule(function () { show(next, list.length); }, slide.duration * 1000);
      }
    }
    if (slide.kind === "product" && !slide.url) {
      display(null);
      return;
    }
    image.onload = function () { display(image); };
    image.onerror = failed;
    loading = window.setTimeout(failed, 9000);
    image.src = slide.url;
  }

  function refresh() {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/diaporama?orientation=" + orientation + (selection ? "&diapo=" + selection[1] : ""));
    request.timeout = 9000;
    request.onload = function () {
      try {
        if (request.status !== 200) return;
        var playlist = JSON.parse(request.responseText);
        var nextContent = JSON.stringify([playlist.slides, playlist.message]);
        if (nextContent === content) return;
        content = nextContent;
        list = playlist.slides;
        generation++;
        window.clearTimeout(timer);
        if (list.length) {
          show(0, list.length);
        } else {
          removeRetiring();
          if (visible) screen.removeChild(visible);
          visible = null;
          empty.querySelector("p").textContent = playlist.message || "Aucun visuel à diffuser.";
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
