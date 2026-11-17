---
version: 1
slug: "frontend-src-app-features-summary-summary-page-ts"
primary_target: "frontend/src/app/features/summary/summary-page.ts"
related_targets: ["frontend/src/app/app.html"]
---

# Global position (`/`)

**Mode:** Operate. **Audience:** the owner (and possibly their partner), on a quick daily check on the phone and in the monthly review at the computer. **Task:** know in seconds how much they have, how the month is going, what is new and which bank needs attention. **Mobile navigation:** the tab bar holds five destinations (platform capacity); «Cuentas y bancos» is left out on purpose and is reached from «Gestionar» in «Mis cuentas», from the «Conectar banco» shortcut and from each bank's «Revisar»/«Renovar». On mobile the month is compressed into three figures so that the first screen also shows the shortcuts and the bank warning. **Constraints:** sample data clearly labeled; nothing absent passed off as a zero; red only for errors and overdrafts.

## Direction contract

THESIS: The "global position" of traditional online banking, executed with the care of the best in the category: the total balance and the month, readable at a glance on a navy band, with every product and movement identified by its icon. It refuses the trendy experiments; convention is the commitment.

OWN-WORLD: Navy #0B2E5F for structure (header and balance band) with white text; corporate blue #1A5BB5 for links and buttons; very light blue-grey ground #F3F6FA and white cards with a soft border and a light shadow; Lucide line icons inside tinted circles; corporate voice in Public Sans (self-hosted, Franklin Gothic tradition) with real tabular figures; the minimalist navy S-and-nail emblem derived from the user’s reference, with rounded monoline character inspired by Threads; each bank’s official identity from Enable Banking or a local copy, with a stable monogram on failure; rounded status chips (green ok, amber warning, red error).

STORY: The visitor sees their total balance and month on the band, uses the shortcuts, notices the warning when a bank needs attention, checks the latest movements (the new ones highlighted until marked as read) and their accounts grouped by bank, each with its status and action.

FIRST VIEWPORT: Navy header with logo, horizontal navigation (desktop) or bottom tab bar (mobile) and the "Datos de ejemplo" chip. Navy band: «Posición global» heading with the date, total balance in large type on the left; income, expenses (bar of spent-of-income) and balance on the right; «Actualizar» button. A shortcuts card straddling the band (4 icons). A bank warning. Below: «Últimos movimientos» (7 columns) and «Mis cuentas» plus «Gastos por categoría» (5 columns).

FORM: Existing summary composition preserved under the owner’s instruction on 17 Nov 2026, “continua con la tarea de claude”, followed by a finite completion list (icon, bank logos, visual review and DESIGN.md). This is a scoped refinement, with no new direction roll or new composition approval claimed. The banking style was previously pinned — "quiero un diseño profesional inspirado en los bancos tradicionales, iconos ... etc los colores que sean los genericos para un banco"; references BBVA and CaixaBank (craft level), palette "Azul marino y blanco".

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
