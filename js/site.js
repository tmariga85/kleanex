/* Kleanex — site behaviour: mobile nav, footer year, enquiry form.
   No dependencies, no build step. */
(function () {
  "use strict";

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    /* close after following an in-page link */
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

  /* ---------------------------------------------------------- enquiry form
     Static hosting has no server to post to, so the form composes a
     pre-filled email in the visitor's own mail client. Swap the handler for a
     form service endpoint (Formspree, Netlify Forms, etc.) if you later want
     submissions to arrive without the visitor's mail program. */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var MAILBOX = "info@kleanex.co.za";

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
      say("Please add your name, email address and a short description of your enquiry.");
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

    var body = [
      "EXPORT ENQUIRY (via kleanex.co.za)",
      "",
      "Name:            " + name,
      "Company:         " + (value("company") || "-"),
      "Email:           " + email,
      "Phone/WhatsApp:  " + (value("phone") || "-"),
      "",
      "Produce line:    " + produce,
      "Destination:     " + (value("destination") || "-"),
      "Volume required: " + (value("volume") || "-"),
      "Incoterms:       " + (value("incoterms") || "Not sure yet"),
      "",
      "Enquiry:",
      message,
      ""
    ].join("\n");

    window.location.href =
      "mailto:" + MAILBOX +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    say("Your email program should now open with this enquiry ready to send. If nothing happens, email " + MAILBOX + " directly.");
  });
})();
