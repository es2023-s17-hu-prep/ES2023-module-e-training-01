// create the template
const template = document.createElement("template");
template.innerHTML = `
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }

    .container {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 25px;
      isolation: isolate;
    }

    .container::before,
    .container::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 5px;
    }
    .container::before {
      left: 0;
      width: 100%;
      background-color: #1976d2;
    }
    .container::after {
      left: var(--highlight-start);
      width: var(--highlight-width);
      max-width: calc(100% - var(--highlight-start));
      background-color: #9c27b0;
    }

    .dot {
      position: relative;
      width: 40px;
      border: 4px solid #1976d2;
      outline-offset: 0;
      aspect-ratio: 1;
      border-radius: 50%;
      background-color: white;
      z-index: 2;
    }
    .dot::before {
      content: attr(data-year);
      position: absolute;
      font-weight: bold;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
      color: #1976d2;
    }
    .dot.filled {
      background-color: #1976d2;
    }

    .dot-dot {
      height: 0px;
      width: 80px;
      margin-right: 6px;
      border-bottom: 6px dashed #f4f4f4;
      z-index: 3;
    }
  </style>

  <div class="container">
  </div>
`;

// create the web component's class
class DateTimeline extends HTMLElement {
  #starting;
  #ending;

  constructor() {
    // call the parent's constructor
    super();

    // attach and append the shadow
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }

  // initialize the elements
  connectedCallback() {
    // calculate the interval
    const interval = this.#ending.year - this.#starting.year;

    // the year following the ending should be displayed, except when the interval is more then 6
    let toYear = interval > 6 ? this.#ending.year : this.#ending.year + 1;
    let fromYear = this.#starting.year;

    // if the interval is less than 5,
    // the timeline should symmetrically extend to show at least a 5 or 6
    if (interval < 5) {
      for (let i = 0; i < (interval % 2 == 0 ? 4 : 5) - interval; i++) {
        if (i % 2 !== 0) fromYear--;
        else toYear++;
      }
    }

    // if the interval is more than 6 years, display only the first 6 years
    let overflow = false;
    if (toYear - fromYear > 6) {
      toYear = fromYear + 6;
      // this.shadowRoot.querySelector(".dot-dot").style.display = "block";
      overflow = true;
    }

    // --- generate the dots ---
    const container = this.shadowRoot.querySelector(".container");
    let innerHTML = container.innerHTML;

    // generate the innerHTML
    for (let year = fromYear; year <= toYear; year++) {
      const filled = year >= this.#starting.year && year <= this.#ending.year;
      innerHTML += `<div 
        class="dot ${filled ? "filled" : ""}" 
        data-year="${year}"
      ></div>`;

      if (year === toYear && overflow) {
        innerHTML += '<div class="dot-dot"></div>';
      }
    }

    container.innerHTML = innerHTML;

    // --- calculate and set the highlighted areas ---
    const yearWidth = 150 + 40; // gap + dot width

    // the start position in px
    const startYearPx = (this.#starting.year - fromYear) * yearWidth;
    const startMonthPx = (yearWidth / 12) * (this.#starting.month + 1);
    const start = Math.floor(startYearPx + startMonthPx);

    // the width in px
    const widthYearPx = (this.#ending.year - this.#starting.year) * yearWidth;
    const widthMonthPx =
      (yearWidth / 12) * Math.abs(this.#ending.month - this.#starting.month);
    const width = widthYearPx + widthMonthPx;

    container.style.setProperty("--highlight-start", `${start}px`);
    container.style.setProperty("--highlight-width", `${width}px`);
  }

  // define the attributes to listen
  static get observedAttributes() {
    return ["starting", "ending"];
  }

  // react to attribute changes
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "starting":
        this.#starting = eval(`(${newValue})`);
        return;
      case "ending":
        this.#ending = eval(`(${newValue})`);
        return;
    }
  }
}

// define the custom element
customElements.define("date-timeline", DateTimeline);
