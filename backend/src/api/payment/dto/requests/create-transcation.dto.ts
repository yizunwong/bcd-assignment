import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  premium!: number;
}
