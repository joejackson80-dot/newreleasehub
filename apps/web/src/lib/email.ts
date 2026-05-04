import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
// Fallback to a dummy key to prevent crashes if it's missing locally
const resendApiKey = process.env.RESEND_API_KEY || 're_mock_key';
const resend = new Resend(resendApiKey);

// A default 'from' email address for the platform
const DEFAULT_FROM = 'New Release Hub <notifications@newreleasehub.com>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      return { success: true, mocked: true };
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('Failed to send email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail({ to, name }: { to: string, name: string }) {
  return sendEmail({
    to,
    subject: 'Welcome to New Release Hub',
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Welcome to NRH</h2>
        <p>Hello ${name},</p>
        <p>Your account has been successfully created. Welcome to the institutional-grade music economy.</p>
      </div>
    `
  });
}

export async function sendNewSUPPORTEREmail({ to, fanName, tierName, artistName }: { to: string, fanName: string, tierName: string, artistName: string }) {
  return sendEmail({
    to,
    subject: 'New SUPPORTER on NRH',
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>New Network SUPPORTER</h2>
        <p>Hello ${artistName},</p>
        <p><strong>${fanName}</strong> has just acquired the <strong>${tierName}</strong> tier.</p>
        <p>This adds to your active institutional capital.</p>
      </div>
    `
  });
}
