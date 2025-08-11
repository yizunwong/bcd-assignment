import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from 'src/enums';

export class TransactionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  coverageId!: number;

  @ApiProperty()
  txHash!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ enum: TransactionStatus })
  status!: TransactionStatus;

  @ApiProperty({ enum: TransactionType })
  type!: TransactionType;

  @ApiProperty()
  createdAt!: string;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
