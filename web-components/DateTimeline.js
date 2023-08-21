const SUMMARIZED_LIMIT = 6;

/**
 * Custom DateTimeline html component
 */
class DateTimeline extends HTMLElement {
    constructor() {
        super();

        // Initialize the shadow dom
        const shadow = this.attachShadow({mode: "open"})

        // Parse properties
        const starting = JSON.parse(this.getAttribute('starting'));
        const ending = JSON.parse(this.getAttribute('ending'));

        // Calculate the difference in whole years
        const difference = ending.year - starting.year + (ending.month > starting.month ? 1 : 0);

        // Calculate years in the timeline
        const affectedYears = ending.year - starting.year + 1;

        // Does it need to be in the summarized view?
        const summarized = difference > SUMMARIZED_LIMIT;

        // Get the start and end year of the timeline (if not summarized)
        const startYear = starting.year - 4 + affectedYears;
        const endYear = ending.year + 6 - affectedYears;

        // Get the visible years in an array
        const years = [];
        const actualStart = summarized ? starting.year : startYear;
        for (let year = actualStart; year < (summarized ? starting.year+SUMMARIZED_LIMIT+1 : endYear); year++) {
            years.push(year)
        }

        // Get the percentage of the start and end lines
        const startingPercent = (starting.year - actualStart + (starting.month-1)/12) / (years.length - 1) * 100;
        const endingPercent = summarized ? 0 : Math.abs(100 - (ending.year - startYear + (ending.month-1)/12) / (years.length - 1) * 100);

        // Create html template for the timeline
        const template = document.createElement('template')
        template.innerHTML = `
            <style>
                /* Styles for the container */
                .container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                /* Blue background line */
                .container::before {
                    content: ' ';
                    left: 0;
                    right: 0;
                    top: 50%;
                    position: absolute;
                    border-top: 2px solid dodgerblue;
                    border-bottom: 2px solid dodgerblue;
                }
                
                /* Purple progress line */
                .container::after {
                    content: ' ';
                    left: ${startingPercent}%;
                    right: ${endingPercent}%;
                    top: 50%;
                    position: absolute;
                    border-top: 2px solid rebeccapurple;
                    border-bottom: 2px solid rebeccapurple;
                }
                
                /* If it is in the summarized view, show the truncated indication extension */
                .extension {
                    width: 32px;
                    height: 4px;
                    margin-top: 4px;
                    background: linear-gradient(to right, rebeccapurple 50%, white 0%);
                    background-size: 8px 4px;
                    z-index: 10;
                }
                
                /* Style for the year label */
                .year {
                    position: relative;
                    padding-bottom: 64px;
                    font-size: 14px;
                    color: dodgerblue;
                    z-index: 10;
                }
                
                /* Year circle */
                .year::before{
                    content: ' ';
                    border: 4px solid dodgerblue;
                    background: white;
                    width: 32px;
                    height: 32px;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    position: absolute;
                    border-radius: 32px;
                }
                
                /* Filled year color */
                .year.fill::before {
                    background: dodgerblue;
                }
            </style>
            <div class="container">
                ${years.map(y => `<div class='year ${y >= starting.year && y <= ending.year ? 'fill' : '' }'>${y}</div>`).join('')}
                ${summarized ? '<div class="extension"></div>' : ''}
            </div>
        `

        // Attach the contents to the shadow dom
        shadow.appendChild(template.content);
    }
}

// Define a custom element
customElements.define('date-timeline', DateTimeline)