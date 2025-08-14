import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
// import { LoanModule } from './api/loan/loan.module';
import { ClaimModule } from './api/claim/claim.module';
import { MulterConfigModule } from './common/multer.config';
import { PolicyModule } from './api/policy/policy.module';
import { CoverageModule } from './api/coverage/coverage.module';
import { PdfClaimExtractorModule } from './api/pdf-claim-extractor/pdf-claim-extractor.module';
import { ReviewsModule } from './api/reviews/reviews.module';
import { CompanyModule } from './api/company/company.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { PaymentModule } from './api/payment/payment.module';
import { ActivityLogModule } from './api/activity-log/activity-log.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './api/notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    SupabaseModule,
    UserModule,
    ClaimModule,
    PolicyModule,
    MulterConfigModule,
    CoverageModule,
    PdfClaimExtractorModule,
    ReviewsModule,
    CompanyModule,
    DashboardModule,
    PaymentModule,
    ActivityLogModule,
    LoggerModule,
    NotificationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
