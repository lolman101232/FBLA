# FBLA

## 1. `<!DOCTYPE html>`

- This line declares the document type, letting the browser know that this is an HTML5 document. It’s essential for ensuring the page displays consistently across browsers.

## 2. `<html lang="en">`

- The `<html>` tag is the root element of the HTML document. The `lang="en"` attribute specifies that the content is in English, which helps search engines and screen readers understand the primary language of the page.

## 3. `<head> ... </head>`

- The `<head>` section contains metadata and links to external resources that are not directly visible on the page but provide important information:
  - `<meta charset="UTF-8">`: Specifies that the document uses UTF-8 character encoding, ensuring all characters display correctly.
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Ensures that the page is responsive and displays well on mobile devices by setting the viewport to match the device’s width and setting an initial zoom level of 100%.
  - `<title>Document</title>`: Sets the title of the page, which appears in the browser’s title bar or tab. In our project, titles are set according to the page function (e.g., "Financial Goals", "Transactions").

## 4. `<body> ... </body>`

- The `<body>` section contains the visible content of the website. In this project, it includes multiple pages such as Dashboard, Transactions, Goals, Investments, and Account pages. Each page is designed with a consistent layout and styling (using `dashboard.css` and Tailwind CSS), and the content is dynamically managed via JavaScript and Firebase.

---

## Project Overview

This project is a comprehensive personal finance management application designed for FBLA competitive events. It helps users track their income, expenses, investments, and financial goals through an intuitive interface and real-time data visualization.

### Key Features:
- **Dashboard:** Displays an overview of spending, category breakdowns, and clustering analysis.
- **Transactions:** Enables users to add, edit, and filter financial transactions.
- **Investments:** Provides real-time stock trends and performance charts.
- **Accounts:** Allows secure management of user profile information.
- **Goals:** Lets users set and track financial goals, with goal cards displaying progress and deadlines.

---

## File Structure

