import { sendEmail } from "@/lib/mailer";

type NotificationEmail = {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

/** Sends a notification email without allowing email delivery errors to interrupt app actions. */
export async function sendNotificationEmail({
  to,
  subject,
  title,
  message,
  actionLabel,
  actionUrl,
}: NotificationEmail) {
  try {
    const appUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
    const href = actionUrl?.startsWith("http")
      ? actionUrl
      : appUrl && actionUrl
        ? `${appUrl}${actionUrl}`
        : undefined;
    const action = actionLabel && href
      ? `<p><a href="${escapeHtml(href)}" style="display:inline-block;background:#059669;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">${escapeHtml(actionLabel)}</a></p>`
      : "";

    await sendEmail({
      to,
      subject,
      html: `<div style="max-width:600px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#12373b"><h1 style="color:#047857">${escapeHtml(title)}</h1><p style="font-size:16px;line-height:1.6">${escapeHtml(message)}</p>${action}<p style="margin-top:28px;color:#52716e">FarmMart Notifications</p></div>`,
    });
    return { sent: true };
  } catch (error) {
    console.error(`Notification email failed for ${to}:`, error);
    return { sent: false };
  }
}
