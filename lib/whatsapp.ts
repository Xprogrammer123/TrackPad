interface BookingNotification {
  customerName: string
  customerEmail: string
  customerPhone: string
  carName: string
  carBrand: string
  startDate: string
  endDate: string
  totalPrice: number
}

interface WhatsAppRecipient {
  phone: string
  apiKey?: string
}

// Add all numbers you want to notify here
const ADMIN_WHATSAPP_RECIPIENTS: WhatsAppRecipient[] = [
  { phone: "+2349138983178", apiKey: process.env.CALLMEBOT_API_KEY },
  { phone: "+2348079088275", apiKey: process.env.CALLMEBOT_API_KEY_2 },
]

export async function sendWhatsAppNotification(booking: BookingNotification) {
  const message = `🚗 *New Booking Alert!*

*Customer Details:*
• Name: ${booking.customerName}
• Email: ${booking.customerEmail}
• Phone: ${booking.customerPhone}

*Car Details:*
• Car: ${booking.carBrand} ${booking.carName}

*Booking Period:*
• From: ${new Date(booking.startDate).toLocaleDateString()}
• To: ${new Date(booking.endDate).toLocaleDateString()}

*Total Price:* ₦${booking.totalPrice.toLocaleString()}

---
TrackPad Services`

  if (!ADMIN_WHATSAPP_RECIPIENTS.length) {
    console.warn("No WhatsApp recipients configured.")
    return { success: false, error: "No recipients configured" }
  }

  try {
    for (const recipient of ADMIN_WHATSAPP_RECIPIENTS) {
      if (!recipient.apiKey) {
        console.warn(`No API key for number ${recipient.phone}, skipping.`)
        continue
      }

      const encodedMessage = encodeURIComponent(message)
      const url = `https://api.callmebot.com/whatsapp.php?phone=${recipient.phone}&text=${encodedMessage}&apikey=${recipient.apiKey}`

      console.log(`Sending WhatsApp notification to ${recipient.phone}...`)

      const response = await fetch(url, { method: "GET" })
      const responseText = await response.text()

      console.log(`WhatsApp API response for ${recipient.phone}:`, response.status, responseText)

      if (!response.ok) {
        console.error(`Failed to send WhatsApp notification to ${recipient.phone}:`, responseText)
      } else {
        console.log(`WhatsApp notification sent successfully to ${recipient.phone}!`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("WhatsApp notification error:", error)
    return { success: false, error: "Failed to send WhatsApp notification" }
  }
}
