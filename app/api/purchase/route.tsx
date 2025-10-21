import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { itemId, itemName, itemType, pointsCost } = await request.json()

    console.log("[v0] Processing purchase:", { itemId, itemName, pointsCost, userId: user.id })

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("total_points, email, username")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile error:", profileError)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    console.log("[v0] User profile:", { points: profile.total_points, email: profile.email })

    // Check if user has enough points
    if (profile.total_points < pointsCost) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 })
    }

    // Deduct points from user's profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        total_points: profile.total_points - pointsCost,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return NextResponse.json({ error: "Failed to deduct points" }, { status: 500 })
    }

    console.log("[v0] Points deducted successfully")

    // Record the purchase
    const { error: purchaseError } = await supabase.from("shop_purchases").insert({
      user_id: user.id,
      item_id: itemId,
      item_name: itemName,
      item_type: itemType,
      points_spent: pointsCost,
    })

    if (purchaseError) {
      console.error("[v0] Purchase record error:", purchaseError)
      // Don't fail the purchase if recording fails
    }

    // Send email receipt (optional - don't fail if email fails)
    if (resend && profile.email) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: profile.email,
          subject: "Your Lyfeline Reward Purchase Receipt",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .item { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                  .points { color: #667eea; font-weight: bold; font-size: 24px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 Purchase Successful!</h1>
                    <p>Thank you for redeeming your points</p>
                  </div>
                  <div class="content">
                    <div class="item">
                      <h2>${itemName}</h2>
                      <p><strong>Points Spent:</strong> <span class="points">${pointsCost} points</span></p>
                      <p><strong>Remaining Balance:</strong> ${profile.total_points - pointsCost} points</p>
                      <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <p>Your reward will be processed and delivered according to the terms. Keep earning points to unlock more rewards!</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated receipt from Lyfeline</p>
                    <p>Continue learning and earning points at your dashboard</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
        console.log("[v0] Email sent successfully")
      } catch (emailError) {
        console.error("[v0] Email error:", emailError)
        // Don't fail the purchase if email fails
      }
    }

    return NextResponse.json({
      success: true,
      newBalance: profile.total_points - pointsCost,
    })
  } catch (error) {
    console.error("[v0] Purchase error:", error)
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 })
  }
}
