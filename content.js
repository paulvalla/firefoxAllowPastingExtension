(function () {
  function allowPaste(e) {
    // Allow the event to propagate normally without restriction
    e.stopImmediatePropagation();
    return true;
  }

  // Intercept paste, drop, and right-click restrictions
  const events = ['paste', 'drop', 'contextmenu', 'dragstart'];
  events.forEach(eventName => {
    document.addEventListener(eventName, allowPaste, true);
  });

  // Clean existing elements that might have inline restrictions
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.removeAttribute('onpaste');
    input.removeAttribute('ondrop');
    input.removeAttribute('oncontextmenu');
    // Ensure user can select text
    input.style.userSelect = "auto";
    input.style.WebkitUserSelect = "auto";
  });

  console.log("Force Paste Enabler: Rules successfully injected.");
})();
