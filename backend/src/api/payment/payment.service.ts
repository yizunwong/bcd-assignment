import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<string | null> {
    const body = new URLSearchParams();
    body.append('amount', Math.round(amount * 100).toString());
    body.append('currency', currency);
    body.append('payment_method_types[]', 'card');

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY ?? ''}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = (await response.json()) as { client_secret?: string };
    return data.client_secret ?? null;
  }
}
