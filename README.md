# Wealth Planner — Website

A responsive personal-finance planning website built with plain HTML, CSS and JavaScript.

This is a **regular website**, not an installable Progressive Web App (PWA). It does not include a service worker, web app manifest, app-install prompt, offline cache or app-install configuration.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Website structure, navigation, calculator inputs and results |
| `styles.css` | Responsive design, dark/light themes, cards, typography and print styling |
| `app.js` | Calculator formulas, interactions, charts, local portfolio storage and exports |
| `README.md` | Project documentation |

The source is intentionally separated into HTML, CSS and JavaScript to keep the project readable and maintainable.

## Features

### 1. SIP Calculator
Estimates the future value of recurring monthly investments.

Inputs:
- Monthly SIP amount
- Expected annual return
- Investment duration
- Annual SIP step-up
- Annual expense-ratio assumption
- Initial SIP pause period in months

Outputs:
- Total invested
- Projected gross corpus
- Estimated profit
- Estimated deductions
- Estimated in-hand corpus

Includes:
- Growth chart
- Return comparison at 8%, 10%, 12%, 15% and 18%
- Five-year projection table (and final year where applicable)
- CSV export
- Print / save-as-PDF
- Reset inputs

The model converts the annual return to an effective monthly rate, applies monthly contributions and step-ups, and reduces the assumed return by the entered expense ratio. Returns are modeled as constant; real market returns fluctuate.

### 2. Portfolio
A manual projection tracker for multiple planned investments.

For each entry, enter:
- Investment/fund name
- Monthly contribution
- Expected annual return
- Duration

The portfolio shows projected gross values and aggregates invested amount, projected corpus, gains, estimated deductions and estimated in-hand value.

Portfolio entries are saved in the browser's local storage on the current device.

**This is not a live mutual-fund tracker.** It does not fetch NAVs, search schemes, import account statements, record actual units or calculate XIRR from real transaction dates. The fund name is descriptive; the return is the assumption entered by the user.

### 3. Goals Planner
Works backwards from a target corpus to estimate the starting monthly SIP required, using the selected duration, expected return and annual step-up.

It displays the estimated starting SIP, total invested, projected gross corpus and estimated deductions.

The section also includes a Lumpsum Calculator for a one-time investment, showing projected gross value, estimated gain, deductions and in-hand value.

### 4. SWP / Withdrawal Planner
Models monthly withdrawals from an existing corpus.

Inputs:
- Starting corpus
- Monthly withdrawal
- Expected annual return
- Withdrawal duration

Outputs:
- Estimated remaining in-hand corpus
- Total gross withdrawals
- Estimated tax and STT
- Total withdrawals received in-hand
- Estimated time until corpus depletion, if depleted during the selected period
- Corpus status

The simulation applies an assumed monthly return before each month-end withdrawal. It estimates cost basis and gains proportionately. Actual tax depends on transaction dates, fund type, financial-year timing and the investor's overall tax position.

### 5. FIRE Calculator
FIRE means Financial Independence, Retire Early.

Inputs:
- Current age
- Current monthly expenses
- Current invested corpus
- Monthly investment
- Annual investment step-up
- Expected annual return
- Annual expense inflation
- Safe withdrawal rate

Outputs:
- Estimated financial-independence target
- Time to FIRE
- Estimated age at FIRE
- Monthly expenses at FIRE
- Projected gross and in-hand corpus
- Estimated tax and charges
- 40-year surplus or shortfall against the 40-year target

The target is based on annual expenses divided by the selected safe withdrawal rate, with expenses increased for inflation. The safe withdrawal rate is an assumption, not a guarantee of sustainable withdrawals.

### 6. Retirement Planner
Estimates the corpus required at a planned retirement age and the monthly investment needed to reach it.

Inputs:
- Current age
- Retirement age
- Age through which expenses should be funded
- Current monthly expenses
- Annual expense inflation
- Current invested corpus
- Monthly investment until retirement
- Annual step-up
- Expected return before retirement
- Expected return after retirement

Outputs:
- Required retirement corpus
- Monthly expenses at retirement
- Projected gross and in-hand corpus
- Estimated deductions
- Surplus or shortfall
- Required starting monthly SIP
- Modeled retirement duration

The target is estimated as the present value at retirement of monthly expenses rising with inflation through the selected end age. The model assumes constant returns and does not automatically include pension, EPF, PPF, NPS, gratuity, rental income, healthcare shocks or other income sources.

## Tax and charge assumptions

Several calculations use a simplified long-term equity-oriented mutual-fund estimate, broadly assuming:
- 12.5% LTCG tax on eligible modeled gains above ₹1,25,000
- 4% cess on estimated tax
- Estimated 0.001% STT on redemption
- Estimated 0.005% stamp duty on SIP purchases

These are simplified planning assumptions, not a personal tax calculation. Actual tax treatment depends on fund category, acquisition/redemption dates, holding period, financial-year exemption usage, other gains, applicable law and individual circumstances. Tax rules may change. Verify current rules independently before making financial decisions.

## Design and usability

- Responsive layout for mobile and desktop browsers
- Dark and light appearance toggle
- Theme preference saved locally in browser storage
- Consistent cards, typography and input controls
- Horizontal tab navigation on narrow screens
- Reduced-motion support
- Print styling for cleaner reports

## Data storage and privacy

- Portfolio entries are stored in browser `localStorage` on the current device.
- Theme preference is also stored locally.
- There is no login, cloud database, automatic synchronization or external account connection.
- Clearing browser/site data can remove saved portfolio entries and preferences.
- Data does not automatically move to another browser or device.
- The app does not need bank credentials, account passwords, PAN or Aadhaar. Do not enter sensitive credentials.

The current version does not include a dedicated backup/restore feature. Keep independent records for important financial information.

## Run locally

You can open `index.html` directly in a modern browser for normal website use.

For local development, you can also start a basic static server from the project directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish as a website

You can host these files on GitHub Pages or any static website host.

For GitHub Pages:
1. Upload `index.html`, `styles.css`, `app.js` and `README.md` to the repository root.
2. Commit and push.
3. Enable GitHub Pages in the repository settings if it is not already enabled.
4. Open the published website URL.

When updating the site, replace the relevant HTML, CSS and JavaScript files and push the commit. There is no service-worker cache to clear.

## Important limitations

Wealth Planner is an educational planning calculator. It does not:
- Execute SIPs, SWPs, purchases, redemptions or fund switches.
- Connect to banks, brokers, AMCs, demat accounts or registrars.
- Fetch live NAVs or market prices.
- Provide personalized investment or tax advice.
- Guarantee returns, retirement dates or tax outcomes.

All projections depend on user-entered assumptions and simplified models. Actual results may differ materially. Validate calculations independently and consult qualified professionals for investment, retirement and tax decisions.

---

**Included version:** six separate sections — SIP, Portfolio, Goals, SWP, FIRE and Retirement — with the professional responsive interface and dark/light themes. This package is a normal static website; PWA and app-install components have been removed.
