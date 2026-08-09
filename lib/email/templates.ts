const brand = "Revved Up Rally";

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${brand}</title></head>
<body style="margin:0;padding:0;background:#000;color:#f5f5f0;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">
    <p style="letter-spacing:0.3em;font-size:12px;text-transform:uppercase;color:#c0c0c0;margin:0 0 32px;">${brand}</p>
    ${content}
    <p style="margin-top:48px;font-size:12px;color:#666;letter-spacing:0.1em;">DRIVE BEYOND ORDINARY.</p>
  </div>
</body>
</html>`;
}

export function applicationReceivedTemplate(data: { name: string; planName: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Application Received</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Thank you for applying to Revved Up Rally (${data.planName}). Our team will review your application and respond shortly.</p>
  `);
}

export function applicationApprovedTemplate(data: { name: string; checkoutUrl: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Welcome — You're Approved</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Your application has been approved. Complete your membership to join the rally.</p>
    <a href="${data.checkoutUrl}" style="display:inline-block;margin-top:24px;padding:16px 32px;border:1px solid #f5f5f0;color:#f5f5f0;text-decoration:none;letter-spacing:0.2em;font-size:12px;">COMPLETE MEMBERSHIP</a>
  `);
}

export function applicationRejectedTemplate(data: { name: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Application Update</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Thank you for your interest in Revved Up Rally. After careful review, we are unable to extend membership at this time.</p>
  `);
}

export function membershipActivatedTemplate(data: {
  name: string;
  membershipNumber: string;
  planName: string;
}) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Membership Activated</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Your ${data.planName} membership is now active.</p>
    <p style="line-height:1.7;color:#ccc;font-size:18px;letter-spacing:0.15em;">${data.membershipNumber}</p>
  `);
}

export function paymentSuccessfulTemplate(data: { name: string; planName: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Payment Confirmed</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Your payment for ${data.planName} membership has been processed successfully.</p>
  `);
}

export function paymentFailedTemplate(data: { name: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Payment Issue</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">We were unable to process your membership payment. Please update your payment method in your dashboard.</p>
  `);
}

export function membershipExpiringTemplate(data: { name: string; expirationDate: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Membership Expiring Soon</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">Your membership expires on ${data.expirationDate}. Renew to maintain access to rallies and member benefits.</p>
  `);
}

export function rallyRegistrationConfirmedTemplate(data: { name: string; rallyName: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Rally Registration Confirmed</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">You're registered for ${data.rallyName}. We'll send additional details as the rally approaches.</p>
  `);
}

export function rallyReminderTemplate(data: { name: string; rallyName: string; startDate: string }) {
  return layout(`
    <h1 style="font-weight:400;font-size:28px;margin:0 0 24px;">Rally Reminder</h1>
    <p style="line-height:1.7;color:#ccc;">Dear ${data.name},</p>
    <p style="line-height:1.7;color:#ccc;">${data.rallyName} begins ${data.startDate}. We look forward to seeing you at the start line.</p>
  `);
}
