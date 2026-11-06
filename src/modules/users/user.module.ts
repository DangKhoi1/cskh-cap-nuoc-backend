import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity.js';
import { USER_REPOSITORY } from './application/ports/user.repository.port.js';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case.js';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case.js';
import { BetterAuthUserRepository } from './infrastructure/persistence/better-auth-user.repository.js';
import { UserController } from './presentation/controllers/user.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    GetMyProfileUseCase,
    UpdateProfileUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: BetterAuthUserRepository,
    },
  ],
})
export class UserModule {}
