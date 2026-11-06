import { Module } from '@nestjs/common';
import type { OnModuleDestroy } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { auth, authDatabase } from './auth.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { BetterAuthClient } from './infrastructure/better-auth.client.js';

@Module({
  imports: [BetterAuthModule.forRoot({ auth })],
  controllers: [AuthController],
  providers: [AuthService, BetterAuthClient],
  exports: [BetterAuthModule],
})
export class AuthModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await authDatabase.end();
  }
}
