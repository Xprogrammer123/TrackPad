const ADMIN_WHATSAPP_NUMBER = "2349138983178"

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

export function generateWhatsAppLink(booking: BookingNotification): string {
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

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`
}

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

  try {
    // Using CallMeBot WhatsApp API (free service)
    // Note: Admin needs to activate this first by sending a message to the bot
    // Instructions: https://www.callmebot.com/blog/free-api-whatsapp-messages/
    const encodedMessage = encodeURIComponent(message)
    const apiKey = process.env.CALLMEBOT_API_KEY

    if (apiKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodedMessage}&apikey=${apiKey}`

      const response = await fetch(url, {
        method: "GET",
      })

      if (!response.ok) {
        console.error("WhatsApp notification failed:", await response.text())
        return { success: false, error: "Failed to send WhatsApp notification" }
      }

      return { success: true }
    }

    // Fallback: Log the message if no API key is configured
    console.log("[WhatsApp Notification]", message)
    return { success: true, fallback: true }
  } catch (error) {
    console.error("WhatsApp notification error:", error)
    return { success: false, error: "Failed to send WhatsApp notification" }
  }
}
