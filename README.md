# Module E - Next-Gen Innovations
* **Automated Testing**
Competitors will demonstrate their proficiency in writing comprehensive automated tests for selected JavaScript components, ensuring the reliability and stability of the guest experience. 
* **Web Component Creation**
Developers will design and implement versatile web components to enhance the web application's interactivity and user experience. These components should showcase reusability and seamless integration into the DineEase platform.
* **Progressive Web App (PWA) Development**
Participants will create a simple yet powerful PWA that serves as the foundation for a future mobile web app. 
The PWA should support offline functionality, push notifications, and seamless installation for enhanced accessibility.

## Task List:

### Automated Tests:

The `DualCalculator` class is a tool that enables dual employer partners to calculate tax refunds and wage costs under various dual training scenarios and conditions. This class interacts with two services. The `SectorService` classifies certifications and maintains the sector-specific multiplier values (e.g., 2.2, 2.42, or 2.85) used in tax refund calculations. On the other hand, the `CertificationService` manages certification entities.

When instantiating the `DualCalculator`, you can provide the starting and ending dates (specified by year and month) of the dual training period, the certification ID, the number of students undergoing dual training, the base amount, the monthly salary paid to these students, and the number of dual training days within the period. Using this information, along with data from the aforementioned services, the calculator computes both the total tax refund and the total salary paid to students.

Both the `SectorService` and `CertificationService` fetch their required data from a server. To launch this server, run the `node server` command within the `/tests/dual-calculator-server` directory.

In the formula for the total tax refund, the base amount is divided by 250 (the number of working days in a year), then multiplied by the sector multiplier. This gives us the amount of tax refund per day and per student. To calculate the total tax refund, this amount should be further multiplied by the number of days spent in training and the number of students participating in the training.

To calculate the total amount spent on salaries, you first need to determine how many months the dual training lasts, then multiply this by the monthly salary and the number of students.

- In this task, you need to demonstrate your proficiency in testing using the popular testing framework, Jest. The primary goal is to assess contestants' ability to write effective unit tests that ensure the correctness and reliability of their codebase.
- You will be provided with a set of pre-defined JavaScript objects and functions that you need to test using Jest. You can find the code inside the `tests/dual-calculator/src` folder.  
- It is expected to write comprehensive test cases that cover different scenarios, including edge cases and common usage scenarios. They should ensure that their tests are well-structured, readable, and capable of catching potential bugs and errors. Points will be awarded based on the accuracy of the tests, the coverage of code paths, and the overall quality of the testing suite.

### Web Components:
Create a standalone web component named `DateTimeline` to visually represent a range of a dual training period.

#### Features:

##### 1. Display
- The timeline displays a horizontal representation of years.
- Each year on the timeline is symbolized by a circle, with the year value displayed above it.

##### 2. Props
- **starting**: An object containing a `year` and `month` property to denote the start date.
- **ending**: An object containing a `year` and `month` property to denote the end date.

##### 3. Range Behavior
- The year immediately following the `ending` year should **always be displayed** on the timeline regardless of the range (except when the interval is more then 6 years).
- If the year interval is **less than 5 years**, the timeline should symmetrically extend to show at least a 5 or 6 year interval.
- If the year interval is **more than 6 years**, display only the first 6 years starting from the `starting` year. Following this range, there should be a short, dotted line, indicating a summarized view.

##### 4. Visual Indicators
- A distinct line segment should appear on the timeline between the starting and ending dates to indicate the "highlighted" range. This segment's color differs from the rest of the timeline.
- Circles falling inside this highlighted range (including the starting year) are filled, while those outside the range are only outlined.
- If the timeline is showing a summarized view (more than 6 years difference), the timeline's right end should have a dotted line extension to indicate truncation.

##### 5. No Dependencies
- This component should be built without relying on any libraries or frameworks.
##### 6. Examples
![Example 1.](web-components/date-timeline-component-sample1.png)
![Example 2.](web-components/date-timeline-component-sample2.png)
![Example 3.](web-components/date-timeline-component-sample3.png)

### PWA Development:
- ...