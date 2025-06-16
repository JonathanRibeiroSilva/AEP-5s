import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../../user/entities/user.entity';
import { Coleta } from '../../coleta/entities/coleta.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Coleta])],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule {}
