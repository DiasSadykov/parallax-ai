import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { createJobRecord, JobState } from '@/clients/db';
import { randomUUID } from 'crypto';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req: NextApiRequest, res: NextApiResponse) =>  {
    let event = req.body;
    if (endpointSecret) {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            return res.status(400).send(`Webhook Error: Missing signature`);
        }
        try {
            event = stripe.webhooks.constructEvent(
                req.read(),
                signature,
                endpointSecret
            );
        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: Signature verification failed.`);
        }
    }
    console.log(event);
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const trainingDataUrl = session.metadata?.trainingDataUrl;
        const email = session.customer_email;
        if (!trainingDataUrl || !email) {
            return res.status(400).send(`Webhook Error: Missing training data url or email`);
        };
        const jobRecord = await createJobRecord({
            id: randomUUID(),
            email: email ?? '',
            jobState: JobState.PENDING,
            trainingDataUrl,
            timestamp: Math.floor(Date.now() / 1000),
            modelId: null,
            modelUrl: null,
            outputIds: null,
            outputUrls: null,
        });
        return res.status(200).json({ message: 'Success', id: jobRecord.id });
    }

}