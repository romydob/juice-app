// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { success_url, cancel_url } = await req.json();

    if (!success_url || !cancel_url) {
      return NextResponse.json(
        { error: "Missing required parameters: success_url or cancel_url" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        // Use a pre-created Price ID
        process.env.STRIPE_PRICE_ID
          ? {
              price: process.env.STRIPE_PRICE_ID,
              quantity: 1,
            }
          : {
              // Or define price inline if you don't have a Price ID
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Juice Contest Entry",
                },
                unit_amount: 2000, // $20 in cents
              },
              quantity: 1,
            },
      ],
      mode: "payment",
      success_url,
      cancel_url,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
