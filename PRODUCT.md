# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** the project owner, an individual in Spain managing their personal finances in euros.
- **Secondary (possible):** their partner, with their own access and a shared joint account. Not confirmed whether data beyond the joint account is shared between them.
- **Jobs, by frequency:**
  1. **Quick daily check**, often on the phone and for a few seconds: how much do I have, what has come in or gone out.
  2. **Monthly review**, sitting down: where the money went and what to adjust.
  3. **Savings and goals**: follow goals (trip, safety cushion, home deposit) and see whether they are on track.

## Product Purpose

Bring together the accounts of several banks in one place and help understand and steer personal finances, both in the daily check and in the monthly review. Success: answering "how am I doing?" in seconds and "where is my money going?" in a few minutes.

## Positioning

- **Everything in one place:** all banks together (via Enable Banking, PSD2), including the joint account with the partner.
- **Privacy and control:** the owner's own tool, with no advertising and no sale of data; the user controls bank access (time-limited PSD2 consents, read-only).
- **AI assistant:** understanding your finances by asking in natural language, not only through charts.

## Operating Context

- Bank connection through Enable Banking (account information under PSD2). Each permission expires (typically 90–180 days) and has to be renewed; a bank may fail to sync or fail to report a balance.
- Backend: Java/Spring Boot with PostgreSQL; AI assistant with Anthropic (Spring AI). Frontend: Angular in `frontend/`.
- Functional modules in the backend: bank connections, accounts, transactions, categories, analytics, savings, assistant.

## Capabilities and Constraints

- Initial banks requested by the owner (17 Nov 2026): **ING, Revolut and CaixaBank**. Sample connections illustrate these names; no real connections are claimed.
- Single currency: **EUR**. Format `es-ES`, interface in Spanish.
- Amounts are integers in cents; a negative sign means money going out.
- A missing data point (`—`, "Sin datos"), a real zero (`0,00 €`) and a loading error must never be confused.
- Read-only on the banks: the product does not move money.
- **Not decided yet:**
  - authentication and per-person data model (owner and partner);
  - the backend's API contract (there are no endpoints yet; the frontend uses clearly labeled sample data).

## Brand Commitments

- Name: **OpenFinance**. Logo: a minimalist navy S interlaced with a nail, inspired by the Esclavitud de la Encarnación emblem in the owner’s reference photograph. The owner requested a rounded monoline style inspired by Threads and navy ink on 17 Nov 2026. Source, generated asset and derivation are documented in `frontend/public/brand/README.md`.
- **Visual language (user decision, 17 Nov 2026):** "a professional design inspired by traditional banks, icons… the colors should be the generic ones for a bank". Palette: **navy blue and white**. Craft-level references: BBVA and CaixaBank (finish level and tone only; neither their brand nor their exact colors are copied).

## Evidence on Hand

- There are no real data, users or testimonials. The figures in the interface are sample data and are labeled as such (`frontend/src/app/data/sample/`). No customers, banks or results may be invented as proof.

## Product Principles

1. **The answer first:** each screen answers its question (how much do I have? where did it go? am I on track?) before showing detail.
2. **Trust through honesty:** every figure says how fresh it is and where it comes from; nothing absent is passed off as zero, and any connection problem is visible next to the accounts it affects.
3. **Control in the user's hands:** access, privacy and renewing permissions are visible and simple, never hidden.
4. **Calm, not alarm:** spending is normal; color and alerts are reserved for what needs attention or action.

## Accessibility & Inclusion

- WCAG 2.2 AA as the minimum (contrast, visible focus, keyboard, screen readers). Respect reduced motion, reduced transparency and increased contrast.
