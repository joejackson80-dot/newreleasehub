import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: 'New Release Hub <onboarding@newreleasehub.com>',
      to: [to],
      subject: 'Welcome to the Network.',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #020202; color: #ffffff;">
          <h1 style="font-style: italic; text-transform: uppercase; letter-spacing: -1px;">Welcome, ${name}.</h1>
          <p style="color: #888888; font-size: 14px; line-height: 1.6;">You have successfully joined the New Release Hub network. Your identity is now verified and active.</p>
          <div style="margin: 40px 0; padding: 20px; border: 1px solid #222; border-radius: 12px; background-color: #0a0a0a;">
             <p style="margin: 0; color: #00D2FF; font-size: 12px; font-weight: bold; text-transform: uppercase;">Next Step</p>
             <p style="margin: 10px 0 0 0; font-size: 16px;">Complete your profile to start participating in master revenue shares.</p>
          </div>
          <p style="color: #444444; font-size: 10px; margin-top: 40px;">© 2025 New Release Hub LLC. Institutional Grade Audio.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
}

export async function sendNewSUPPORTEREmail(to: string, artistName: string, SUPPORTERName: string, amount: number) {
  try {
    await resend.emails.send({
      from: 'New Release Hub <alerts@newreleasehub.com>',
      to: [to],
      subject: 'New SUPPORTER Secured.',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #020202; color: #ffffff;">
          <p style="color: #00D2FF; font-size: 10px; font-weight: bold; text-transform: uppercase;">Alert: New Participation</p>
          <h1 style="font-style: italic; text-transform: uppercase; letter-spacing: -1px;">$${amount} Settlement.</h1>
          <p style="color: #888888; font-size: 14px; line-height: 1.6;">${SUPPORTERName} has just acquired a master participation license for your catalog.</p>
          <p style="color: #444444; font-size: 10px; margin-top: 40px;">© 2025 New Release Hub LLC. Institutional Grade Audio.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
}


