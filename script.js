document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight the current page in the nav
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.classList.add('is-active');
  });

  // Static form handling (no backend wired up) — show a friendly
  // confirmation instead of submitting, so the page is safe to
  // preview as-is. Replace with a real form action when ready.
  document.querySelectorAll('form[data-static-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
      form.reset();
    });
  });
});

// slider

document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
  var track = gallery.querySelector('.gallery__track');
  var prev = gallery.querySelector('.gallery__btn--prev');
  var next = gallery.querySelector('.gallery__btn--next');
  var timer;

  function stepSize() {
    var slide = track.querySelector('.gallery__slide');
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  function goNext() {
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) { track.scrollTo({ left: 0 }); }
    else { track.scrollBy({ left: stepSize() }); }
  }

  function goPrev() {
    if (track.scrollLeft <= 4) { track.scrollTo({ left: track.scrollWidth }); }
    else { track.scrollBy({ left: -stepSize() }); }
  }

  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stop();
    timer = setInterval(goNext, 4000);
  }
  function stop() { clearInterval(timer); }

  next.addEventListener('click', function () { goNext(); start(); });
  prev.addEventListener('click', function () { goPrev(); start(); });
  gallery.addEventListener('mouseenter', stop);
  gallery.addEventListener('mouseleave', start);
  gallery.addEventListener('touchstart', stop, { passive: true });
  gallery.addEventListener('touchend', start, { passive: true });

  start();
});