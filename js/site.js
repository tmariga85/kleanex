/* Kleanex — site behaviour: mobile nav, hero carousel, footer year, enquiry form.
   No dependencies, no build step. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------- footer year */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------- hero carousel */
  (function () {
    var hero = document.getElementById("hero");
    if (!hero) return;

    var slides = hero.querySelectorAll("[data-slide]");
    var copies = hero.querySelectorAll("[data-copy]");
    var dots = hero.querySelectorAll("[data-hero-dot]");
    var count = Math.max(slides.length, copies.length);
    if (count < 2) return;

    var index = 0;
    var timer = null;
    var INTERVAL = 7000;

    function show(next) {
      index = (next + count) % count;
      for (var i = 0; i < count; i++) {
        if (slides[i]) slides[i].classList.toggle("is-active", i === index);
        if (copies[i]) copies[i].classList.toggle("is-active", i === index);
        if (dots[i]) dots[i].setAttribute("aria-selected", i === index ? "true" : "false");
      }
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () { show(index + 1); }, INTERVAL);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function goTo(next) { stop(); show(next); start(); }

    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); });

    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    show(0);
    start();
  })();

  /* ---------------------------------------------------------- season calendar
     Hovering a month swells that bar, lights up its row and its column, and
     names what is running in the readout under the chart. */
  (function () {
    var table = document.querySelector("table.season");
    if (!table) return;

    var readout = document.querySelector("[data-season-readout]");
    var hint = readout ? readout.innerHTML : "";
    var headers = table.querySelectorAll("thead th");

    function clear() {
      Array.prototype.forEach.call(table.querySelectorAll(".col-active"), function (el) {
        el.classList.remove("col-active");
      });
      Array.prototype.forEach.call(table.querySelectorAll(".row-active"), function (el) {
        el.classList.remove("row-active");
      });
      Array.prototype.forEach.call(table.querySelectorAll(".is-hot"), function (el) {
        el.classList.remove("is-hot");
      });
      if (readout) readout.innerHTML = hint;
    }

    function highlight(td) {
      clear();
      var col = td.cellIndex;
      td.classList.add("is-hot");
      if (td.parentNode) td.parentNode.classList.add("row-active");
      if (headers[col]) headers[col].classList.add("col-active");
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (tr) {
        if (tr.cells[col]) tr.cells[col].classList.add("col-active");
      });

      if (!readout) return;
      var state = td.getAttribute("data-state") || "";
      readout.innerHTML =
        '<span><b>' + td.getAttribute("data-fruit") + '</b> &middot; ' +
        td.getAttribute("data-month") + '</span>' +
        '<span class="tag" data-state="' + state + '">' + state + "</span>";
    }

    table.addEventListener("mouseover", function (e) {
      var td = e.target;
      while (td && td !== table && td.tagName !== "TD") td = td.parentNode;
      if (td && td.tagName === "TD" && td.hasAttribute("data-month")) highlight(td);
    });

    table.addEventListener("mouseleave", clear);

    /* keyboard and touch: focusing a row label walks its whole season */
    table.addEventListener("focusout", clear);
  })();

  /* ---------------------------------------------------------- crossfading photo slots
     Any .ph--fade slot cycles through its images. An image whose file is
     missing removes itself (see the onerror in the markup), so the list is
     re-read on every tick and a slot left with one photo simply holds it. */
  Array.prototype.forEach.call(document.querySelectorAll(".ph--fade"), function (slot) {
    var index = 0;

    function live() { return slot.querySelectorAll("img[data-fade]"); }

    function show(n) {
      var imgs = live();
      if (!imgs.length) return;
      index = (n + imgs.length) % imgs.length;
      Array.prototype.forEach.call(imgs, function (img, i) {
        img.classList.toggle("is-shown", i === index);
      });
    }

    show(0);
    if (reduceMotion || live().length < 2) return;

    window.setInterval(function () {
      if (document.hidden) return;
      if (live().length > 1) show(index + 1);
    }, 5500);
  });

  /* ---------------------------------------------------------- enquiry form
     Static hosting has no server to post to, so the form composes a
     pre-filled email in the visitor's own mail client. Swap this handler for a
     form service endpoint (Formspree, Netlify Forms) if you later want
     submissions to arrive without the visitor's mail program. */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var MAILBOX = "tawanda@kleanex.co.za";

  function value(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : "";
  }

  function say(text) {
    if (!status) return;
    status.textContent = text;
    status.classList.add("show");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = value("name");
    var email = value("email");
    var message = value("message");

    if (!name || !email || !message) {
      say("Please add your name, email address and a short message.");
      (document.getElementById(!name ? "name" : !email ? "email" : "message") || form).focus();
      return;
    }
    if (email.indexOf("@") < 1 || email.indexOf(".") < 0) {
      say("That email address does not look right — please check it.");
      document.getElementById("email").focus();
      return;
    }

    var produce = value("produce") || "Not specified";
    var subject = "Export enquiry: " + produce + " — " + (value("company") || name);

    var lines = [
      "EXPORT ENQUIRY (via kleanex.co.za)",
      "",
      "Name:            " + name,
      "Company:         " + (value("company") || "-"),
      "Email:           " + email,
      "Phone/WhatsApp:  " + (value("phone") || "-"),
      "",
      "Product:         " + produce,
      "Country/market:  " + (value("destination") || "-"),
      "Volume required: " + (value("volume") || "-"),
      "Incoterms:       " + (value("incoterms") || "-"),
      "",
      "Message:",
      message,
      ""
    ];

    window.location.href =
      "mailto:" + MAILBOX +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    say("Your email program should now open with this enquiry ready to send. If nothing happens, email " + MAILBOX + " directly.");
  });
})();
