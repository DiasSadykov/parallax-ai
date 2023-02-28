import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe publishable key');
}

if (!process.env.STRIPE_PRICE_ID) {
  throw new Error('Missing Stripe price id');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authSession = await getServerSession(req, res, authOptions);
  if(!authSession) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if(!req.body.trainingDataUrl){
    return res.status(400).json({ message: 'No training data' });
  }
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        metadata: {
          trainingDataUrl: req.body.trainingDataUrl
        },
        customer_email: authSession.user?.email ?? undefined, 
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        discounts: process.env.STRIPE_PROMOTION_CODE ? [
          {
            promotion_code: process.env.STRIPE_PROMOTION_CODE,
          }
        ] : undefined,
        allow_promotion_codes: true,
        mode: 'payment',
        success_url: `${req.headers.origin}/dashboard`,
        cancel_url: `${req.headers.origin}/`,
        automatic_tax: {enabled: true},
      });
      if (!session.url) {
        throw new Error('No session url');
      }
      res.json({url: session.url})
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}