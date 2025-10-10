import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { entryData, success_url, cancel_url } = await req.json();

    if (!success_url || !cancel_url) {
      return NextResponse.json(
        { error: "Missing required parameters: success_url or cancel_url" },
        { status: 400 }
      );
    }

    // Insert entry server-side using the service key
    await supabaseAdmin.from("entries").insert([entryData]);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        process.env.STRIPE_PRICE_ID
          ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
          : {
              price_data: {
                currency: "usd",
                product_data: { name: "Juice Contest Entry" },
                unit_amount: 2000, // $20
              },
              quantity: 1,
            },
      ],
      mode: "payment",
      success_url,
      cancel_url,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
  let message = "Unknown error";
  if (err instanceof Error) message = err.message;
  return NextResponse.json({ error: message }, { status: 500 });
}
}
