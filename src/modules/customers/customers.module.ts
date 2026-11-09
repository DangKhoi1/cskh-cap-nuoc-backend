import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerLinkEntity } from './infrastructure/persistence/customer-link.entity.js';
import { CUSTOMER_LINK_REPOSITORY } from './application/ports/customer-link.repository.port.js';
import { TypeOrmCustomerLinkRepository } from './infrastructure/persistence/typeorm-customer-link.repository.js';
import { V2_CUSTOMER_PORT } from './application/ports/v2-customer.port.js';
import { MockV2CustomerAdapter } from './infrastructure/adapter/mock-v2-customer.adapter.js';
import { CustomerLinkUseCase } from './application/use-cases/customer-link.use-case.js';
import { GetCustomerLinksUseCase } from './application/use-cases/get-customer-link.use-case.js';
import { CustomerLinkController } from './presentation/controllers/customer-link.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerLinkEntity])],
    controllers: [CustomerLinkController],
    providers: [
        CustomerLinkUseCase,
        GetCustomerLinksUseCase,
        {
            provide: CUSTOMER_LINK_REPOSITORY,
            useClass: TypeOrmCustomerLinkRepository,
        },
        {
            provide: V2_CUSTOMER_PORT,
            useClass: MockV2CustomerAdapter,
        },
    ],
    exports: [CUSTOMER_LINK_REPOSITORY, V2_CUSTOMER_PORT],
})
export class CustomersModule { }
