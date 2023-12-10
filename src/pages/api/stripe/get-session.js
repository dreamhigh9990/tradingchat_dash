// send an image to google's vision API, and return similar items and descriptions(?).

import { CHAT_MONTHLY, CHAT_SIXMONTH, CHAT_YEARLY, PAYMENT_CANCEL } from "@/constant/constants";
import { User } from "@/libs/firebase/user";

export default async function handler(req, res) {
  try {
    const { subscription_id, user_id } = req.query;
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    // The price ID passed from the client
    //   const {priceId} = req.body;
    const subscription = await stripe.subscriptions.retrieve(subscription_id);
    // console.log({ subscription });
    let plan = CHAT_MONTHLY;
    if (subscription.plan.id == `${process.env.STRIPE_MONTHLY_PLAN}`) {
      plan = CHAT_MONTHLY;
    } else if (subscription.plan.id == `${process.env.STRIPE_YEARLY_PLAN}`) {
      plan = CHAT_YEARLY;
    } else if (subscription.plan.id == `${process.env.STRIPE_SIXMONTH_PLAN}`) {
      plan = CHAT_SIXMONTH;
    }
    const curSecondsTime = (new Date()).getTime() / 1000;
    if (curSecondsTime < subscription.current_period_end) {
      const { result, error } = await User.get(user_id);
      // console.log({ result })
      if (result.subscription != subscription.id || result.period_end != subscription.current_period_end || result.plan != plan) {
        await User.update(user_id, {
          subscription: subscription.id,
          period_end: subscription.current_period_end,
          plan,
        })
      }
    } else {
      plan = PAYMENT_CANCEL;
      await User.update(user_id, {
        subscription: subscription.id,
        period_end: subscription.current_period_end,
        plan,
      })
    }

    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    res.status(200).json({
      period_end: subscription.current_period_end,
      plan
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      error: `${{ error }}`,
    });
  }
}

