import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../user/entities/user.entity';
import {
    Coleta,
    TipoColeta,
    DiaSemana,
} from '../../coleta/entities/coleta.entity';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Coleta)
        private coletaRepository: Repository<Coleta>
    ) {}

    async run(): Promise<void> {
        await this.seedUsers();
        await this.seedColetas();
        this.logger.log('Seed executado com sucesso!');
    }

    private async seedUsers(): Promise<void> {
        const userCount = await this.userRepository.count();
        if (userCount > 0) {
            this.logger.log('Usuários já existem, pulando seed de usuários');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = this.userRepository.create({
            email: 'admin@maringa.com',
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        await this.userRepository.save(admin);
        this.logger.log('Usuário admin criado: admin@maringa.com / admin123');
    }

    private async seedColetas(): Promise<void> {
        const coletaCount = await this.coletaRepository.count();
        if (coletaCount > 0) {
            this.logger.log('Coletas já existem, pulando seed de coletas');
            return;
        }

        const coletas = [
            // Zona 1 - Centro
            {
                bairro: 'Centro',
                diaSemana: DiaSemana.SEGUNDA,
                tipoColeta: TipoColeta.CONVENCIONAL,
                horario: '07:00',
                observacoes: 'Coleta nas ruas principais',
                tiposResiduos:
                    'Lixo doméstico geral, restos de alimentos, papéis sujos',
            },
            {
                bairro: 'Centro',
                diaSemana: DiaSemana.QUARTA,
                tipoColeta: TipoColeta.SELETIVA,
                horario: '08:00',
                observacoes: 'Coleta de recicláveis',
                tiposResiduos: 'Papel, plástico, vidro, metal',
            },
            // Zona 2 - Jardim Alvorada
            {
                bairro: 'Jardim Alvorada',
                diaSemana: DiaSemana.TERCA,
                tipoColeta: TipoColeta.CONVENCIONAL,
                horario: '07:30',
                observacoes: 'Coleta em todo o bairro',
                tiposResiduos: 'Lixo doméstico geral, restos de alimentos',
            },
            {
                bairro: 'Jardim Alvorada',
                diaSemana: DiaSemana.QUINTA,
                tipoColeta: TipoColeta.SELETIVA,
                horario: '08:30',
                observacoes: 'Coleta de materiais recicláveis',
                tiposResiduos: 'Papel, plástico, vidro, metal',
            },
            // Zona 3 - Vila Esperança
            {
                bairro: 'Vila Esperança',
                diaSemana: DiaSemana.QUARTA,
                tipoColeta: TipoColeta.CONVENCIONAL,
                horario: '06:30',
                observacoes: 'Coleta iniciando cedo',
                tiposResiduos: 'Lixo doméstico geral, restos orgânicos',
            },
            {
                bairro: 'Vila Esperança',
                diaSemana: DiaSemana.SEXTA,
                tipoColeta: TipoColeta.SELETIVA,
                horario: '09:00',
                observacoes: 'Coleta seletiva no final da semana',
                tiposResiduos: 'Papel, plástico, vidro, metal',
            },
            // Zona 4 - Conjunto Habitacional
            {
                bairro: 'Conjunto Habitacional Inocente Vila Nova',
                diaSemana: DiaSemana.QUINTA,
                tipoColeta: TipoColeta.CONVENCIONAL,
                horario: '08:00',
                observacoes: 'Coleta no conjunto habitacional',
                tiposResiduos: 'Lixo doméstico geral',
            },
            {
                bairro: 'Conjunto Habitacional Inocente Vila Nova',
                diaSemana: DiaSemana.SEGUNDA,
                tipoColeta: TipoColeta.SELETIVA,
                horario: '09:30',
                observacoes: 'Coleta de recicláveis no início da semana',
                tiposResiduos: 'Papel, plástico, vidro, metal',
            },
            // Zona 5 - Sarandi
            {
                bairro: 'Sarandi',
                diaSemana: DiaSemana.SEXTA,
                tipoColeta: TipoColeta.CONVENCIONAL,
                horario: '07:00',
                observacoes: 'Coleta no distrito de Sarandi',
                tiposResiduos: 'Lixo doméstico geral, restos orgânicos',
            },
            {
                bairro: 'Sarandi',
                diaSemana: DiaSemana.TERCA,
                tipoColeta: TipoColeta.SELETIVA,
                horario: '08:00',
                observacoes: 'Coleta seletiva no distrito',
                tiposResiduos: 'Papel, plástico, vidro, metal',
            },
        ];

        for (const coletaData of coletas) {
            const coleta = this.coletaRepository.create(coletaData);
            await this.coletaRepository.save(coleta);
        }

        this.logger.log(`${coletas.length} registros de coleta criados`);
    }
}
