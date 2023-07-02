onUiLoaded(() => {
  // Shamelessly copied from canvas-zoom-and-pan
  const elementIDs = {
    sketch: "#img2img_sketch",
    inpaintSketch: "#inpaint_sketch",
    inpaint: "#img2maskimg",
  };
  const elements = Array.from(Object.values(elementIDs)).map((id) =>
    gradioApp().querySelector(id)
  );



  // modified from https://stackoverflow.com/questions/79816/need-javascript-code-for-button-press-and-hold
  let holdIt = (btn, action, start, speedup, limit) => {
    let t;
    let startValue = start;

    let repeat = () => {
      action();
      t = setTimeout(repeat, startValue);
      startValue > limit ? (startValue /= speedup) : (startValue = limit);
    };

    btn.onmousedown = () => {
      repeat();
    };
    btn.ontouchstart = () => {
      navigator.vibrate(70);
      repeat();
    };

    const stopActionEvents = ["mouseup", "mouseout", "touchend", "touchmove"];

    stopActionEvents.forEach((event) => {
      btn.addEventListener(event, () => {
        clearTimeout(t);
        startValue = start;
      });
    });
  };


  function makeButton(text, onclick) {
    const button_el = document.createElement("button");
    button_el.className = "lg secondary gradio-button svelte-1ipelgc";
    button_el.style = "margin-right: 10px; padding-inline: 20px; user-select: none;";
    button_el.innerHTML = text;
      
    // button_el.onclick = () => {};
    holdIt(button_el, onclick, 500, 2, 3);
    return button_el;
  }

  function applyInpaintingNav(el) {
    const div_el = document.createElement("div");
    div_el.style =
      "margin-top: 10px; margin-bottom: 10px; margin-inline: auto; text-align: center;";
    div_el.innerHTML = `<p><b>Mobile Inpainting Navigation</br>Press and hold supported</b></br>Scroll Sensitivity</p>`;

    //add slider
    const slider_el = document.createElement("input");
    slider_el.type = "range";
    slider_el.min = 10;
    slider_el.max = 200;
    slider_el.value = 25;
    slider_el.title = "Scroll amount";
    // inline style for now
    slider_el.style =
      "display: block; width:50%; margin-bottom: 20px; margin-inline: auto;";

    function scrollDiv(el, direction) {
      switch (direction) {
        case "up":
          el.scrollBy({
            top: -slider_el.value,
            
          });
          break;
        case "down":
          el.scrollBy({
            top: slider_el.value,
            
          });
          break;
        case "left":
          el.scrollBy({
            left: -slider_el.value,
            
          });
          break;
        case "right":
          el.scrollBy({
            left: slider_el.value,
            
          });
          break;
      }
    }

    div_el.appendChild(slider_el);

    //add buttons
    const left_el = makeButton("⬅️", () => scrollDiv(el, "left"));
    const down_el = makeButton("⬇️", () => scrollDiv(el, "down"));
    const up_el = makeButton("⬆️", () => scrollDiv(el, "up"));
    const right_el = makeButton("➡️", () => scrollDiv(el, "right"));

    div_el.appendChild(left_el);
    div_el.appendChild(down_el);
    div_el.appendChild(up_el);
    div_el.appendChild(right_el);

    // insert div_el befire el
    el.parentNode.insertBefore(div_el, el);
  }

  elements.forEach((el) => {
    applyInpaintingNav(el);
  });

  // Make it global for other scripts to use :)
  window.applyInpaintingNav = applyInpaintingNav;
});
