import { Injectable } from '@nestjs/common';
import { CommonResponseDto } from 'src/common/common.dto';
import { PaymentIntentResponseDto } from './dto/responses/payment-intent.dto';

@Injectable()
export class PaymentService {
  async createPaymentIntent(amount: number, currency: string) {
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

    const data = (await response.json()) as { client_secret: string };
    return new CommonResponseDto<PaymentIntentResponseDto>({
      statusCode: 200,
      message: 'Payment intent created successfully',
      data: { clientSecret: data.client_secret },
    });
  }
}
