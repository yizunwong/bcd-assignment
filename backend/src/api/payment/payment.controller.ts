import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/requests/create-intent.dto';
import { PaymentIntentResponseDto } from './dto/responses/payment-intent.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTransactionDto } from './dto/requests/create-transaction.dto';
import { TransactionResponseDto } from './dto/responses/transaction.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  @ApiCommonResponse(PaymentIntentResponseDto, false, 'Create payment intent')
  async createIntent(
    @Body() body: CreatePaymentIntentDto,
  ): Promise<CommonResponseDto<PaymentIntentResponseDto>> {
    return await this.paymentService.createPaymentIntent(
      body.amount,
      body.currency,
    );
  }

  @Post('transaction')
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return await this.paymentService.recordTransaction(dto, req);
  }

  @Get('transactions')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(TransactionResponseDto, true, 'Fetch user transactions')
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<TransactionResponseDto[]>> {
    return await this.paymentService.fetchTransactions(req);
  }
}
