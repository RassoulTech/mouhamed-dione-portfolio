/* Premium HTML email template for contact-form messages.
   Inline styles only — Gmail / Outlook strip <style> blocks aggressively.
   Layout uses tables for maximum client compatibility. */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function messageHtml(raw) {
  /* Preserve paragraph breaks as <br>, escape any HTML the sender typed. */
  return escapeHtml(raw).replace(/\r?\n/g, "<br />");
}

function fmtDate(d = new Date()) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Dakar",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export function buildHtmlEmail({ name, email, subject, message, source }) {
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject || "Nouveau message"),
    source: escapeHtml(source || "cv-mouhamed.vercel.app"),
    date: fmtDate(),
    body: messageHtml(message),
    replyHref: `mailto:${escapeHtml(email)}?subject=${encodeURIComponent(
      "Re: " + (subject || "Nouveau message")
    )}`,
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>Nouveau message · Portfolio Mouhamed Dione</title>
  </head>
  <body style="margin:0;padding:0;background:#F2F4F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1C1C1E;">
    <!-- Preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F2F4F9;opacity:0;">
      ${safe.name} t'ecrit a propos de ${safe.subject}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F4F9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#FFFFFF;border-radius:22px;overflow:hidden;box-shadow:0 18px 60px -28px rgba(28,28,30,0.22);">

            <!-- HEADER BAND (ink + blue accent) -->
            <tr>
              <td style="background:#1C1C1E;padding:28px 32px 22px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-size:10.5px;letter-spacing:0.32em;text-transform:uppercase;color:#7B8CFF;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;">
                        Portfolio · Mouhamed Dione
                      </p>
                      <p style="margin:8px 0 0 0;font-size:22px;font-weight:700;color:#FAFAFA;line-height:1.2;letter-spacing:-0.01em;">
                        Nouveau message<span style="color:#2E5BFF;">.</span>
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;padding:7px 14px;background:#2E5BFF;color:#FFFFFF;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;border-radius:9999px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;">
                        Contact
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Accent rule -->
            <tr><td style="height:2px;background:#2E5BFF;line-height:2px;font-size:2px;">&nbsp;</td></tr>

            <!-- BODY -->
            <tr>
              <td style="padding:32px 32px 12px 32px;">

                <!-- Sender card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F6FA;border-radius:16px;border:1px solid #E8EBF2;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="vertical-align:top;">
                            <p style="margin:0;font-size:10px;letter-spacing:0.26em;text-transform:uppercase;color:#7d818c;font-family:'SFMono-Regular',Consolas,monospace;">
                              Expediteur
                            </p>
                            <p style="margin:6px 0 2px 0;font-size:18px;font-weight:700;color:#1C1C1E;letter-spacing:-0.01em;">
                              ${safe.name}
                            </p>
                            <a href="mailto:${safe.email}" style="color:#2E5BFF;font-size:14px;text-decoration:none;font-weight:500;">
                              ${safe.email}
                            </a>
                          </td>
                          <td align="right" style="vertical-align:top;">
                            <span style="display:inline-block;width:44px;height:44px;border-radius:9999px;background:#2E5BFF;color:#FFFFFF;text-align:center;line-height:44px;font-size:16px;font-weight:800;letter-spacing:-0.01em;">
                              ${safe.name
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase() || "?"}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Subject -->
                <p style="margin:26px 0 8px 0;font-size:10px;letter-spacing:0.26em;text-transform:uppercase;color:#7d818c;font-family:'SFMono-Regular',Consolas,monospace;">
                  Sujet
                </p>
                <p style="margin:0;font-size:17px;font-weight:600;color:#1C1C1E;line-height:1.4;letter-spacing:-0.005em;">
                  ${safe.subject}
                </p>

                <!-- Message -->
                <p style="margin:26px 0 10px 0;font-size:10px;letter-spacing:0.26em;text-transform:uppercase;color:#7d818c;font-family:'SFMono-Regular',Consolas,monospace;">
                  Message
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFC;border-left:3px solid #2E5BFF;border-radius:0 14px 14px 0;">
                  <tr>
                    <td style="padding:18px 22px;font-size:15px;line-height:1.72;color:#3C404B;">
                      ${safe.body}
                    </td>
                  </tr>
                </table>

                <!-- Action buttons -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
                  <tr>
                    <td>
                      <a href="${safe.replyHref}" style="display:inline-block;background:#1C1C1E;color:#FAFAFA;text-decoration:none;padding:14px 26px;border-radius:9999px;font-weight:600;font-size:14px;letter-spacing:0.01em;">
                        Repondre a ${safe.name.split(/\s+/)[0]} &nbsp;→
                      </a>
                    </td>
                    <td style="padding-left:10px;">
                      <a href="mailto:${safe.email}" style="display:inline-block;background:transparent;color:#1C1C1E;text-decoration:none;padding:14px 22px;border:1px solid #D7D9E0;border-radius:9999px;font-weight:600;font-size:14px;">
                        Email direct
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:18px 32px 22px 32px;border-top:1px solid #EDF0F5;background:#FAFAFC;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:10.5px;letter-spacing:0.22em;text-transform:uppercase;color:#9CA0AB;font-family:'SFMono-Regular',Consolas,monospace;">
                      Recu le ${safe.date}
                    </td>
                    <td align="right" style="font-size:10.5px;letter-spacing:0.22em;text-transform:uppercase;color:#9CA0AB;font-family:'SFMono-Regular',Consolas,monospace;">
                      via ${safe.source}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

          <!-- Outer footnote -->
          <p style="margin:18px auto 0 auto;max-width:580px;font-size:11px;line-height:1.6;color:#9CA0AB;text-align:center;">
            Ce message provient du formulaire de contact du portfolio.<br />
            Tu peux y repondre directement — l'adresse <strong style="color:#1C1C1E;">${safe.email}</strong> est mise en reply-to.
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildPlainTextEmail({ name, email, subject, message, source }) {
  return [
    "Portfolio Mouhamed Dione — Nouveau message",
    "============================================",
    "",
    `Expediteur : ${name} <${email}>`,
    `Sujet      : ${subject || "Nouveau message"}`,
    `Recu le    : ${fmtDate()}`,
    `Source     : ${source || "cv-mouhamed.vercel.app"}`,
    "",
    "--- Message ---",
    "",
    message,
    "",
    "--- Fin du message ---",
    "",
    `Pour repondre, ecris directement a ${email}.`,
  ].join("\n");
}
