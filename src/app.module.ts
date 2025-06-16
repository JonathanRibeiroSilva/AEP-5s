import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ColetaModule } from './coleta/coleta.module';
import { SeedModule } from './common/seeds/seed.module';
import { SeedService } from './common/seeds/seed.service';
import { User } from './user/entities/user.entity';
import { Coleta } from './coleta/entities/coleta.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'maringa_coleta.db',
            entities: [User, Coleta],
            synchronize: true,
            logging: true,
        }),
        AuthModule,
        UserModule,
        ColetaModule,
        SeedModule,
    ],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly seedService: SeedService) {}

    async onModuleInit() {
        await this.seedService.run();
    }
}
