import { inngest } from '../client'
import { resend } from '@/lib/resend'

export const sendEmailNotification = inngest.createFunction(
  {
    id: 'send-email-notification',
    name: 'Send Email Notification',
    retries: 5,
    rateLimit: {
      limit: 100,
      period: '1s',
      key: 'event.data.type',
    },
    triggers: [{ event: 'email/notification.send' }],
  },
  async ({ event }: { event: any }) => {
    const { to, subject, body, type } = event.data

    await resend.emails.send({
      from: 'New Release Hub <noreply@newreleasehub.com>',
      to,
      subject,
      html: body,
    })

    return { sent: true, to, type }
  }
)
