import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateClaimStatusDto {
  @ApiProperty({
    description: 'Transaction hash associated with the claim status update',
    example: '0x123abc456def789...',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  txHash?: string;
}
