import nodemailer from "nodemailer";
import { buildHtmlEmail, buildPlainTextEmail } from "./_email-template.js";

/* Vercel serverless function — Node.js runtime.
   POST /api/contact
     body: { name, email, subject?, message, _honey? }
     200 -> { ok: true }
     400 -> { ok: false, error }
     500 -> { ok: false, error }

   Env (set on Vercel) :
     GMAIL_USER          ex. dionemhd1@gmail.com  (required)
     GMAIL_APP_PASSWORD  Google App Password, 16 chars, no spaces  (required)
     CONTACT_TO_EMAIL    optional, defaults to GMAIL_USER
*/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function reject(res, code, error) {
  return res.status(code).json({ ok: false, error });
}

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reject(res, 405, "Method not allowed");
  }

  const transporter = getTransport();
  if (!transporter) {
    return reject(
      res,
      500,
      "Service mail non configure (GMAIL_USER / GMAIL_APP_PASSWORD manquant)."
    );
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

  if (honey) return res.status(200).json({ ok: true });

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

  const gmailUser = process.env.GMAIL_USER;
  const to = process.env.CONTACT_TO_EMAIL || gmailUser;

  try {
    await transporter.sendMail({
      /* "from" must remain the authenticated Gmail address — providers
         silently drop spoofed senders. We set the display name and pin
         the sender's email into the reply-to so a single click answers
         the visitor directly. */
      from: `"Portfolio · Mouhamed Dione" <${gmailUser}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio · ${name} — ${subject || "Nouveau message"}`,
      html,
      text,
      headers: {
        "X-Portfolio-Source": source,
        "X-Portfolio-Form": "contact-v1",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] Nodemailer error:", err);
    const msg =
      err?.code === "EAUTH"
        ? "Authentification Gmail refusee (App Password invalide ou 2FA non actif)."
        : err?.message || "Echec interne. Reessaye plus tard.";
    return reject(res, 502, msg);
  }
}
