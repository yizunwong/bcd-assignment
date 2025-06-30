// import { Controller, Post, Body, Param, Get } from '@nestjs/common';
// import { LoanService } from './loan.service';
// import { CreateLoanDto } from './dto/requests/create.dto';

// @Controller('loan')
// export class LoanController {
//   constructor(private readonly loanService: LoanService) {}

//   @Post('create')
//   async createLoan(@Body() body: CreateLoanDto) {
//     return this.loanService.createLoan(body.amount);
//   }

//   @Post('repay/:id')
//   async repayLoan(@Param('id') id: string) {
//     return this.loanService.repayLoan(+id);
//   }

//   @Get(':id')
//   async getLoan(@Param('id') id: string) {
//     return this.loanService.getLoan(+id);
//   }
// }
