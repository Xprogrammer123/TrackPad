const ADMIN_WHATSAPP_NUMBER = "+2349138983178"

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
    const apiKey = process.env.CALLMEBOT_API_KEY

    console.log("[v0] WhatsApp API Key exists:", !!apiKey)
    console.log("[v0] Sending to number:", ADMIN_WHATSAPP_NUMBER)

    if (apiKey) {
      const encodedMessage = encodeURIComponent(message)
      const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodedMessage}&apikey=${apiKey}`

      console.log("[v0] Sending WhatsApp notification...")

      const response = await fetch(url, {
        method: "GET",
      })

      const responseText = await response.text()
      console.log("[v0] WhatsApp API response status:", response.status)
      console.log("[v0] WhatsApp API response:", responseText)

      if (!response.ok) {
        console.error("WhatsApp notification failed:", responseText)
        return { success: false, error: "Failed to send WhatsApp notification" }
      }

      console.log("[v0] WhatsApp notification sent successfully!")
      return { success: true }
    }

    console.log("[v0] No API key - fallback mode")
    return { success: true, fallback: true }
  } catch (error) {
    console.error("[v0] WhatsApp notification error:", error)
    return { success: false, error: "Failed to send WhatsApp notification" }
  }
}
