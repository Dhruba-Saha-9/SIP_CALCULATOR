# Wealth Planner

A responsive personal finance and investment planning website built using HTML, CSS, and JavaScript.

Wealth Planner helps users estimate investment growth, plan financial goals, track projected portfolios, and calculate retirement and financial independence targets.

This is a **regular static website**, not an installable app or PWA.

## Features

### 1. SIP Calculator
- Calculate monthly SIP growth.
- Annual SIP step-up.
- Expected annual return.
- Investment duration.
- Expense ratio adjustment.
- Option to pause SIP for initial months.
- Invested amount, estimated profit, and projected corpus.
- Estimated tax and charges.
- Estimated in-hand corpus.
- Growth chart.
- Return comparison at 8%, 10%, 12%, 15%, and 18%.
- Five-year investment breakdown.
- CSV export.
- Print or save results as PDF.
- Reset calculator.

### 2. Portfolio
- Add multiple planned investments.
- Enter investment name, monthly SIP, expected return, and duration.
- View projected investment values.
- Track total invested amount, estimated gains, deductions, and in-hand corpus.
- Portfolio data is saved locally in the browser.

**Note:** This is currently a projection-based portfolio tracker. It does not fetch live mutual fund NAVs or calculate actual investment returns.

### 3. Goals
Includes two tools:

**Goal Planner**
- Enter your target corpus.
- Set investment duration.
- Set expected return.
- Add annual SIP step-up.
- Calculate the estimated monthly SIP required.

**Lumpsum Calculator**
- Calculate the future value of a one-time investment.
- View estimated returns and total corpus.

### 4. SWP Calculator
- Enter your starting investment corpus.
- Set monthly withdrawals.
- Set expected annual return.
- Select withdrawal duration.
- Calculate remaining corpus.
- Estimate total withdrawals and deductions.
- Estimate when the corpus may run out.

### 5. FIRE Calculator
(Financial Independence, Retire Early)

- Enter your current age.
- Enter current monthly expenses.
- Add your existing investment corpus.
- Set monthly investments and annual step-up.
- Set expected returns and inflation.
- Adjust the safe withdrawal rate.
- Estimate your FIRE target.
- Calculate estimated time to financial independence.
- Estimate your FIRE age.
- View projected corpus and estimated deductions.
- Check long-term surplus or shortfall.

### 6. Retirement Calculator
- Enter current age.
- Set retirement age and planned end age.
- Enter current monthly expenses.
- Adjust inflation.
- Add existing corpus.
- Set monthly investments and annual step-up.
- Set pre-retirement and post-retirement returns.
- Estimate the required retirement corpus.
- Calculate projected corpus and surplus or shortfall.
- Estimate the monthly SIP required.

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

No frontend framework or backend server is required.

## Project Structure

```text
Wealth-Planner/
│
├── index.html
├── styles.css
├── app.js
└── README.md
