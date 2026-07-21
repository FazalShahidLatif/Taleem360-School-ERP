// services/notifications/whatsappBillingService.ts

interface InvoiceNotificationPayload {
  tutorId: string;
  tutorName: string;
  studentUserId: string;
  studentPhone: string; // Must be clean country code format, e.g., "+923001234567"
  studentName?: string; // Added to prevent TypeScript compile errors as it is accessed in the message body
  amount: number;
  currency: string;
  paymentLink: string;
}

/**
 * Dispatches a beautifully formatted transactional payment reminder message to the student on WhatsApp.
 */
export async function sendWhatsAppBillingAlert(payload: InvoiceNotificationPayload): Promise<string | null> {
  const WHATSAPP_API_URL = process.env.WHATSAPP_GATEWAY_URL || 'https://facebook.com';
  const AUTH_TOKEN = process.env.WHATSAPP_BEARER_TOKEN || '';

  // Clean and sanitize the phone format string securely to ensure global transport integrity
  const cleanPhone = payload.studentPhone.replace(/[^+\d]/g, '');

  try {
    // Constructing standard Meta Cloud template message parameters
    const messageBody = {
      messaging_product: "whatsapp",
      to: cleanPhone,
      type: "template",
      template: {
        name: "taleem360_tutor_invoice", // Template approved in Meta dashboard
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: payload.studentName || "Learner" },
              { type: "text", text: payload.tutorName },
              { type: "text", text: `${payload.amount} ${payload.currency}` },
              { type: "text", text: payload.paymentLink } // Simple direct invoice download link
            ]
          }
        ]
      }
    };

    // If API credentials are blank (local fallback/sandbox configurations) fail-safe gracefully
    if (!AUTH_TOKEN) {
      console.log(`[WhatsApp Sandbox Simulation] Mock alert dispatched to ${cleanPhone} for Amount: ${payload.amount}`);
      return `mock-sid-${Math.random().toString(36).substring(7)}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageBody),
      signal: controller.signal as any
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WhatsApp API network transport failed with status: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.messages?.[0]?.id || null;

  } catch (error) {
    console.error('[WhatsApp Service Exception] Failed to broadcast transactional notification safely:', error);
    return null; // Return null instead of breaking execution threads
  }
}
