import { defineMiddlewares } from "@medusajs/framework/http";
import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";

/**
 * Interrupteur de suspension — pendant du proxy.ts du storefront Next.js.
 *
 * SITE_SUSPENDED=true sur Railway :
 *   - medusa-config.ts ne monte plus le dashboard admin (admin.disable),
 *   - ce middleware sert à la place une page 503 propre sur /app, au lieu
 *     du « Cannot GET /app » brut d'Express.
 *
 * Les API /store/* et /admin/* restent en ligne : commandes, webhooks et
 * données continuent de fonctionner, seule l'interface est coupée.
 *
 * Quand SITE_SUSPENDED n'est pas à "true", le middleware laisse simplement
 * passer, donc le dashboard est servi normalement.
 */

const TITLE = "Back-office temporairement indisponible";
const MESSAGE =
  "L'interface d'administration est momentanément hors ligne. Merci de réessayer ultérieurement.";

function suspendedPage() {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #f6f5f2;
    --card: #ffffff;
    --border: #e6e3dc;
    --text: #1c1b19;
    --muted: #6d6a63;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #121110;
      --card: #1b1a18;
      --border: #2e2c29;
      --text: #f1efea;
      --muted: #9a958c;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--bg);
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  .card {
    width: 100%;
    max-width: 30rem;
    padding: 40px 32px;
    text-align: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
  }
  .icon {
    width: 44px;
    height: 44px;
    margin-bottom: 20px;
    color: var(--muted);
  }
  h1 {
    margin: 0 0 12px;
    font-size: 1.375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: var(--muted);
    font-size: 0.975rem;
  }
</style>
</head>
<body>
  <main class="card">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
    <h1>${TITLE}</h1>
    <p>${MESSAGE}</p>
  </main>
</body>
</html>`;
}

function suspendedAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  if (process.env.SITE_SUSPENDED !== "true") {
    return next();
  }

  res.status(503);
  res.setHeader("Cache-Control", "no-store, must-revalidate");
  res.setHeader("Retry-After", "86400");

  // Les assets du dashboard (JS/CSS) ne doivent pas recevoir du HTML.
  if (!(req.headers.accept ?? "").includes("text/html")) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(
      JSON.stringify({ error: "service_unavailable", message: MESSAGE }),
    );
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(suspendedPage());
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/app*",
      middlewares: [suspendedAdmin],
    },
  ],
});
