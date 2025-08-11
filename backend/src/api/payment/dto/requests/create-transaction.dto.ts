import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TransactionStatus, TransactionType } from 'src/enums';

export class CreateTransactionDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the policy associated with this transaction',
  })
  @IsInt()
  @IsNotEmpty()
  coverageId!: number;

  @ApiProperty({
    example: '0xabc123',
    description: 'Blockchain transaction hash',
  })
  @IsString()
  @IsNotEmpty()
  txHash!: string;

  @ApiProperty({
    example: 100,
    description: 'Premium amount paid for the policy',
  })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    example: 'ETH',
    description: 'Currency of the premium payment',
  })
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({
    example: TransactionStatus.CONFIRMED,
    description: 'Status of the transaction',
    enum: TransactionStatus,
  })
  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status!: TransactionStatus;

  @ApiProperty({
    example: TransactionType.SENT,
    description: 'Type of transaction',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;
}
