# IIT Delhi Certificate Generator

A certificate generation and download platform for students and staff of the **Indian Institute of Technology Delhi**.

This project allows users to securely log in via institutional credentials or Google, and download official or mock certificates based on session, semester, and programme data.

---

## Authenticated Access

Users can log in via:

- Email Sign-In (Web 1.0)
- Google Account Sign-In
- IITD Auth System 

Only authenticated users are allowed to generate certificates.

---

## Demo / Mimic Site

If you're not an IIT Delhi user and wish to try a mock/demo version:

Visit: [https://certificategenerator-production.up.railway.app]

To get access:
1. Register on the site using your email.
2. Then request approval by emailing: `prakhar7.cstaff@iitd.ac.in`

You will be provided with temporary credentials to log in and generate mock certificates for testing purposes.

---

## Tech Stack

### Frontend
- Next.js with TypeScript
- App Router
- Tailwind CSS (if used)
- NextAuth.js for authentication

### Backend
- Python (Flask) API for certificate generation
### Database
- MongoDB (NoSQL) for certificate metadata and user records

---

## How It Works

1. User logs in via IIT Delhi or Google.
2. Fills in entry number or selects session/semester/programme.
3. A `.docx` template is filled and converted to PDF via the Python backend.
4. The file is streamed to the browser for direct download.

---

## Contact

For access requests, contributions, or deployment queries:
- Email: `prakhar7.cstaff@iitd.ac.in`

---

## Disclaimer

This tool is intended for official use by IIT Delhi staff/students. Do not share credentials or misuse certificate generation for fraudulent purposes.
