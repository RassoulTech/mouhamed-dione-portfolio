import { Resend } from "resend";
import { buildHtmlEmail, buildPlainTextEmail } from "./_email-template.js";

/* Vercel serverless function — runs in the Node.js runtime.
   Contract:
     POST /api/contact
     body: { name, email, subject?, message, _honey? }
     200 -> { ok: true, id }
     400 -> { ok: false, error }
     500 -> { ok: false, error }

   Env:
     RESEND_API_KEY        required
     CONTACT_TO_EMAIL      optional (default: dionemhd1@gmail.com)
     CONTACT_FROM_ADDRESS  optional (default: onboarding@resend.dev)
*/

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "dionemhd1@gmail.com";
const FROM_ADDRESS =
  process.env.CONTACT_FROM_ADDRESS ||
  "Portfolio Mouhamed Dione <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function reject(res, code, error) {
  return res.status(code).json({ ok: false, error });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reject(res, 405, "Method not allowed");
  }

  if (!process.env.RESEND_API_KEY) {
    return reject(res, 500, "Service mail non configure (RESEND_API_KEY manquant).");
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return reject(res, 400, "Payload JSON invalide.");
    }
  }
  payload = payload || {};

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const honey = String(payload._honey || "");

  /* Honeypot: bots auto-fill hidden fields. Silently pretend success. */
  if (honey) return res.status(200).json({ ok: true, id: "honeypot" });

  if (!name || name.length < 2 || name.length > 80) {
    return reject(res, 400, "Nom invalide (2-80 caracteres).");
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 120) {
    return reject(res, 400, "Email invalide.");
  }
  if (subject.length > 140) {
    return reject(res, 400, "Sujet trop long (140 caracteres max).");
  }
  if (!message || message.length < 5 || message.length > 4000) {
    return reject(res, 400, "Message invalide (5-4000 caracteres).");
  }

  const source =
    (req.headers["x-forwarded-host"] || req.headers.host || "").toString() ||
    "cv-mouhamed.vercel.app";

  const html = buildHtmlEmail({ name, email, subject, message, source });
  const text = buildPlainTextEmail({ name, email, subject, message, source });

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Portfolio · ${name} — ${subject || "Nouveau message"}`,
      html,
      text,
      tags: [
        { name: "source", value: "portfolio-contact" },
        { name: "form", value: "v1" },
      ],
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return reject(res, 502, error.message || "Echec de l'envoi.");
    }

    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error("[contact] Unhandled error:", err);
    return reject(res, 500, "Echec interne. Reessaye plus tard.");
  }
}
