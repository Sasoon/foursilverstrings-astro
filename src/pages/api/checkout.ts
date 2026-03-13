import Stripe from "stripe";
import type { APIRoute } from "astro";

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { title, price, quantity, size, frame, image, cancelUrl } = body;

    if (!title || !price || !quantity) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `${title} — ${size}`,
              description: frame || "Unframed",
              images: image ? [image] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["AU", "NZ", "US", "GB", "CA", "DE", "FR", "JP"],
      },
      success_url: `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ? `${url.origin}${cancelUrl}` : `${url.origin}/paintings`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
