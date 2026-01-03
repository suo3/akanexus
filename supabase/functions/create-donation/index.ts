import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DONATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { amount, itemName, itemId, itemType } = await req.json();
    logStep("Request body parsed", { amount, itemName, itemId, itemType });

    if (!amount || amount <= 0) {
      throw new Error("Invalid donation amount");
    }

    // Convert dollars to cents
    const amountInCents = Math.round(amount * 100);
    logStep("Amount converted to cents", { amountInCents });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create a one-time payment session with price_data for custom amounts
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation for ${itemName}`,
              description: `Thank you for supporting us! Downloading ${itemType}: ${itemName}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/donation-success?item=${encodeURIComponent(itemName)}&type=${itemType}&id=${itemId}`,
      cancel_url: `${req.headers.get("origin")}/${itemType === 'component' ? 'gallery' : 'templates'}`,
      submit_type: "donate",
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-donation", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
