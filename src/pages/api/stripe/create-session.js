// send an image to google's vision API, and return similar items and descriptions(?).

import { CHAT_MONTHLY, CHAT_SIXMONTH, CHAT_YEARLY, PAYMENT_CANCEL } from '@/constant/constants';
import { LINKS } from '@/constant/links';

export default async function handler(req, res) {
    try {
        const { plan, user_id } = req.query;
        let stripePlan = null;

        if (plan) {
            if (plan == CHAT_MONTHLY) {
                stripePlan = `${process.env.STRIPE_MONTHLY_PLAN}`;
            } else if (plan == CHAT_YEARLY) {
                stripePlan = `${process.env.STRIPE_YEARLY_PLAN}`;
            } else if (plan == CHAT_SIXMONTH) {
                stripePlan = `${process.env.STRIPE_SIXMONTH_PLAN}`;
            }
        }

        // See your keys here: https://dashboard.stripe.com/apikeys
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

        // The price ID passed from the client
        //   const {priceId} = req.body;
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: stripePlan,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
            // the actual Session ID is returned in the query parameter when your customer
            // is redirected to the success page.
            // success_url:  "https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
            success_url: `${process.env.HOST}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
            cancel_url: `${process.env.HOST}${LINKS.LOGIN.ROUTE}?plan=${PAYMENT_CANCEL}`,
        });

        // console.log({ session });

        if (session.url) {
            res.status(200).json({ sessionUrl: session?.url });
            return;
        }
        res.status(400).json({
            message: "Something went wrong in create-session. Check error logs. ",
        });
    } catch (error) {
        console.log({ error });
        res.status(400).json({
            error: `${{ error }}`,
        });
    }
}

