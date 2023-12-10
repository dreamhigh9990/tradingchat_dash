// send an image to google's vision API, and return similar items and descriptions(?).

import { auth } from "@/configs/firebase";
import { CHAT_MONTHLY, CHAT_SIXMONTH, CHAT_YEARLY } from "@/constant/constants";
import { LINKS } from "@/constant/links";
import { User } from "@/libs/firebase/user";


export default async function handler(req, res) {
  try {
    const { session_id, user_id } = req.query;
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    // The price ID passed from the client
    //   const {priceId} = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    // console.log({ subscription });
    let plan = CHAT_MONTHLY;
    if (subscription.plan.id == `${process.env.STRIPE_MONTHLY_PLAN}`) {
      plan = CHAT_MONTHLY;
    } else if (subscription.plan.id == `${process.env.STRIPE_YEARLY_PLAN}`) {
      plan = CHAT_YEARLY;
    } else if (subscription.plan.id == `${process.env.STRIPE_SIXMONTH_PLAN}`) {
      plan = CHAT_SIXMONTH;
    }

    await User.update(user_id, {
      subscription: subscription.id,
      period_end: subscription.current_period_end,
      plan,
    })
    //    current_period_end: 1696289646,
    //    current_period_start: 1693697646,
    res.redirect(307, `${LINKS.PRICING.ROUTE}?plan=${plan}`)
  } catch (error) {
    console.log({ error });
    res.redirect(307, `${LINKS.PRICING.ROUTE}?error=${error}`)
  }
}

