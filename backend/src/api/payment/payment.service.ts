import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommonResponseDto } from 'src/common/common.dto';
import { PaymentIntentResponseDto } from './dto/responses/payment-intent.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CreateTransactionDto } from './dto/requests/create-transaction.dto';
import { TransactionResponseDto } from './dto/responses/transaction.dto';
import { TransactionStatus, TransactionType } from 'src/enums';

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

  async recordTransaction(
    dto: CreateTransactionDto,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data, error } = await req.supabase
      .from('transactions')
      .insert({
        user_id: userData.user.id,
        coverage_id: dto.coverageId,
        description: dto.description,
        tx_hash: dto.txHash,
        amount: dto.amount,
        currency: dto.currency,
        created_at: new Date().toISOString(),
        status: dto.status,
        type: dto.type,
      })
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      throw new InternalServerErrorException('Failed to record transaction');
    }

    // Update next payment date for premium payments
    if (!dto.description.toLowerCase().includes('purchased')) {
      const { data: coverage, error: coverageError } = await req.supabase
        .from('coverage')
        .select('next_payment_date')
        .eq('id', dto.coverageId)
        .single();

      if (!coverageError && coverage?.next_payment_date) {
        const nextPayment = new Date(coverage.next_payment_date);
        nextPayment.setMonth(nextPayment.getMonth() + 1);
        const { error: updateError } = await req.supabase
          .from('coverage')
          .update({
            next_payment_date: nextPayment.toISOString().split('T')[0],
          })
          .eq('id', dto.coverageId);

        if (updateError) {
          console.error(updateError);
        }
      } else {
        console.error(coverageError);
      }
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Transaction recorded successfully',
      data,
    });
  }

  async fetchTransactions(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<TransactionResponseDto[]>> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data, error } = await req.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch transactions');
    }

    const mapped = data.map(
      (tx) =>
        new TransactionResponseDto({
          id: tx.id,
          coverageId: tx.coverage_id,
          txHash: tx.tx_hash,
          description: tx.description,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status as TransactionStatus,
          type: tx.type as TransactionType,
          createdAt: tx.created_at,
        }),
    );

    return new CommonResponseDto<TransactionResponseDto[]>({
      statusCode: 200,
      message: 'Transactions fetched successfully',
      data: mapped,
      count: mapped.length,
    });
  }
}
