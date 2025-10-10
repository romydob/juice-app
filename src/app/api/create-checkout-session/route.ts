// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Ensure this route is server-only
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not set!");
  return createClient(url, key);
}

type EntryInsert = {
  user_id: string;
  contest_id: string;
  drink_name: string;
  description: string;
  ingredients: string;
  dietary_tags: string[];
  image_url?: string | null;
};

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY in environment" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body: { entryData: EntryInsert; success_url: string; cancel_url: string } =
      await req.json();
    const { entryData, success_url, cancel_url } = body;

    if (!success_url || !cancel_url) {
      return NextResponse.json(
        { error: "Missing required parameters: success_url or cancel_url" },
        { status: 400 }
      );
    }

    // Insert entry server-side
    const { error: insertError } = await supabaseAdmin.from("entries").insert([entryData]);
    if (insertError) throw insertError;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: process.env.STRIPE_PRICE_ID
        ? [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "aud",
                product_data: { name: "Juice Contest Entry" },
                unit_amount: 2000,
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
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
