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
- **Chat Bot:** Acts as guide and helper for user if help is required
- **Goals:** Lets users set and track financial goals, with goal cards displaying progress and deadlines.

---

## File Structure


---

## Templates, Libraries & Open-Source Material

- **Tailwind CSS:**  
  - Used for rapid, consistent styling.
  - Documentation: [Tailwind CSS Docs](https://tailwindcss.com/docs)

- **Chart.js:**  
  - Utilized for interactive charts and visual data representation.
  - Documentation: [Chart.js Docs](https://www.chartjs.org/docs/latest/)

- **Firebase:**  
  - Provides user authentication and real-time database functionality.
  - Documentation: [Firebase Docs](https://firebase.google.com/docs)

- **APIs for Investments:**  
  - Real-time stock data is fetched using the Twelve Data API (or Alpha Vantage API if configured).
  - Documentation: [Twelve Data API Docs](https://twelvedata.com/docs) | [Alpha Vantage API Docs](https://www.alphavantage.co/documentation/)

- **Langchain and Ollama for the AI**
  - Accessing the AI model is done through Ollama
  - Used Langchain to feed the model data
  - Documentation: Ollama (https://ollama.com/) Langchain (https://www.langchain.com/)

- **Tesseract**
  - Use tesseract to extract text from a webcam picture
  - Documentation: (https://github.com/tesseract-ocr/tesseract)

- **Flask**
  - Use Flask to connect python code to Javascript and then HTML
  - Sets up an API that can be called by Javascript to gather and return strings
  - Documentation: (https://flask.palletsprojects.com/)

Any open-source libraries used are referenced above, and all source code is original or adapted from standard templates with proper attribution where necessary.

---

## Licensing

This project is licensed under the MIT License. Please refer to the LICENSE file in the repository for the full text of the license.

---

## Additional Documentation

- **Source Code:** All source files are provided in the repository, with inline comments explaining key functions and components.
- **Templates & Libraries:** Detailed references are provided above to ensure proper attribution and adherence to open-source licensing requirements.
- **Competitive Event Requirements:** This README, along with the source code and additional documentation, meets the FBLA Coding & Programming competitive event guidelines. The documentation covers all required aspects including functionality, user experience, code quality, and data management.

For further information, please refer to the accompanying documentation in the repository or contact [Pranav Bhumana] at [pranav.bhumana8@gmail.com].
