import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/persistence/user.entity.js';
import { USER_REPOSITORY } from './application/ports/user.repository.port.js';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case.js';
import { BetterAuthUserRepository } from './infrastructure/persistence/better-auth-user.repository.js';
import { UserController } from './presentation/controllers/user.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    GetMyProfileUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: BetterAuthUserRepository,
    },
  ],
})
export class UserModule {}
