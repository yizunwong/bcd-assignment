import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/requests/create-intent.dto';
import { PaymentIntentResponseDto } from './dto/responses/payment-intent.dto';

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
}
