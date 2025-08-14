import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaymentStatsDto {
  @ApiProperty({
    type: Number,
    example: 1000,
    description: 'Total amount of payouts received by the user.',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPayoutsReceived!: number;

  @ApiProperty({
    type: Number,
    example: 500,
    description: 'Total premium amount the user needs to pay.',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPremiumToPay!: number;
}
