# NRH PROPRIETARY ALGORITHMS — DO NOT EXPOSE TO CLIENT BUNDLE

This directory contains the intellectual property of New Release Hub LLC, including:
- Discovery & Ranking Algorithms
- Royalty Distribution Logic
- Anti-Fraud & Stream Verification
- Automated Curation Systems

### SECURITY PROTOCOLS
1. **No Client Imports**: Files in this directory MUST NEVER be imported by "use client" components.
2. **Server-Only Execution**: All logic must be executed within Server Components, API Routes, or Server Actions.
3. **Sensitive Fields**: Ensure `sanitizeResponse` is used before returning data from these systems to the client.
4. **IP Protection**: Do not expose the exact weighting of ranking factors or royalty multipliers in public-facing documentation or API responses.
