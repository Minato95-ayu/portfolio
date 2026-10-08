# AAYU Portfolio

An interactive portfolio for Ayush Kaushik, focused on systems programming, AI research, compilers, and engineering projects.

## Overview

This project combines a personal portfolio with interactive technical experiences. It is built with React and TypeScript, with Three.js powering the 3D technology universe.

## Features

- Interactive 3D technology universe with selectable languages, AI systems, and learning tracks.
- Project, research, and engineering expertise sections.
- Neural chess game and Ask AAYU assistant.
- Responsive layout with motion preferences and WebGL fallback support.
- Contact form that forwards inquiries to Gmail through FormSubmit without requiring an API key.

## Technology

- React 19 and TypeScript
- Vite 8
- Three.js
- Tailwind CSS 4
- Express and Zod for the local development server and APIs
- Motion for interface animations

## Run Locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

The development site runs at `http://localhost:3000`.

Useful checks:

```sh
npm run lint
npm run build
```

Ask AAYU works with its built-in local knowledge fallback. Optional model-provider keys can be configured in a local `.env` file using the names in `.env.example`. Keep real credentials private and never add them to browser code or commit them.

## Contact Form and Email Privacy

The contact form uses FormSubmit's free email relay to forward messages to `ayushkaushik1441@gmail.com`; no Resend account or API key is required. Form data is sent to FormSubmit, a third-party service, before it reaches the inbox. The recipient address is present in the public site code, so it is not a secret.

On the first submission, FormSubmit sends an activation message to the recipient inbox. Open that message and confirm the form before relying on delivery. Keep the built-in CAPTCHA enabled to reduce spam. If the relay is unavailable, visitors can open a pre-filled email draft and send it from their own email app.

Do not submit passwords, private keys, or other sensitive information through the form.

## Deploy

Build the static frontend with `npm run build` and deploy the generated `dist/` directory to a static hosting provider. The contact form requires a browser-accessible internet connection to reach FormSubmit. Optional server APIs require a Node.js host that can run `server.ts`.

## Contact

- Email: [ayushkaushik1441@gmail.com](mailto:ayushkaushik1441@gmail.com)
- GitHub: [Minato95-ayu](https://github.com/Minato95-ayu)
- LinkedIn: [Ayush Kaushik](https://www.linkedin.com/in/ayushh-kaushiq-1a950825a)
- YouTube: [How Computers Think — Zero to Research](https://youtube.com/@ayushkaushik08)
