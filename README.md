# Project 05 — NovaCart Mini E-Commerce App

A responsive mini e-commerce demo built with HTML, CSS and vanilla JavaScript.

## Features
- 8 products rendered dynamically from a JavaScript array
- Category filters and price sorting
- Add to cart, quantity increase/decrease and remove item
- Cart count, subtotal, delivery fee and grand total
- ₹40 delivery fee for a non-empty subtotal below ₹500; free delivery at ₹500 and above
- INR formatting using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`
- Cart persistence with localStorage
- Checkout dialog preview (demo only; no payment is collected)
- Responsive layout

## Project files
- `index.html` — page structure
- `style.css` — responsive design and styling
- `script.js` — product data, cart state, calculations and interactions

This is a front-end learning project. It does not process payments or create real orders.
