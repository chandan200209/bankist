# bankist
Banking Web App (HTML • CSS • JavaScript)

A small, responsive frontend prototype that simulates a bank website — built with vanilla HTML, CSS and JS. Designed to showcase realistic banking flows (transfer funds, request loans), good UX patterns (timers, session handling), and internationalization so the UI feels native across regions.

Think of it as a fintech toy you can actually show stakeholders: tiny footprint, big learnings.

🚀 Features

Sign in / Sign out (simple PIN-based auth for demo purposes)

Transfer money between accounts

Request a loan (simple simulated approval flow)

Session/transaction timers (auto-timeout handling)

Dates, times and currency formatted per locale

Change locale to see localized date/currency formats

Clean, modular code — easy to extend into a real app or attach APIs

🧩 Tech stack

HTML5

CSS3 (responsive)

Vanilla JavaScript (ES6+)

No build step required — pure static site

🛠️ Getting started (run locally)

Clone the repo:

git clone <your-repo-url>
cd <repo-folder>


Open index.html in your browser — or use a static server:

# If you have Python 3
python -m http.server 8000
# Then open http://localhost:8000

# For VS Code
Also, you can open live-server in the terminal

Enjoy the demo flows.

🔐 Demo credentials

Use these demo accounts to log in and test all functionality.

Username: js
PIN (password): 1111

Username: jd
PIN (password): 2222

These are demo credentials only — do not use in production. The app uses client-side demo auth for learning and UI exploration.

✅ How to use

Open the app and log in with one of the demo accounts above.

Explore the dashboard: view balances, interest, recent transactions.

Transfer funds

Select an account, enter recipient details and amount.

Confirm the transfer — timers simulate processing and auto-logout edge cases.

Request a loan

Fill loan amount, submit the request.

Change the locale setting to observe date/time and currency formatting for different regions.

⏱️ Timers & Session Handling

Session timer: automatic logout after inactivity (demo value configurable in code).

Transaction timers: show processing states and timeouts to simulate real banking UX.

These are implemented with clean, testable timer utilities in the JS codebase.

Small demo, practical learnings — built to be understood, extended, and shipped into a portfolio. If you want, I can also generate example API endpoints and a basic Node/Express backend to make the demo persistent and a bit more production-like.
