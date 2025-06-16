import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coleta } from './entities/coleta.entity';
import { CreateColetaDto } from './dto/create-coleta.dto';
import { UpdateColetaDto } from './dto/update-coleta.dto';
import { FilterColetaDto } from './dto/filter-coleta.dto';

@Injectable()
export class ColetaService {
    constructor(
        @InjectRepository(Coleta)
        private coletaRepository: Repository<Coleta>
    ) {}

    async create(createColetaDto: CreateColetaDto): Promise<Coleta> {
        const coleta = this.coletaRepository.create(createColetaDto);
        return await this.coletaRepository.save(coleta);
    }

    async findAll(): Promise<Coleta[]> {
        return await this.coletaRepository.find({
            order: { bairro: 'ASC', diaSemana: 'ASC' },
        });
    }

    async findByFilters(filters: FilterColetaDto): Promise<Coleta[]> {
        const queryBuilder = this.coletaRepository.createQueryBuilder('coleta');

        if (filters.bairro) {
            queryBuilder.andWhere('LOWER(coleta.bairro) LIKE LOWER(:bairro)', {
                bairro: `%${filters.bairro}%`,
            });
        }

        if (filters.diaSemana) {
            queryBuilder.andWhere('coleta.diaSemana = :diaSemana', {
                diaSemana: filters.diaSemana,
            });
        }

        if (filters.tipoColeta) {
            queryBuilder.andWhere('coleta.tipoColeta = :tipoColeta', {
                tipoColeta: filters.tipoColeta,
            });
        }

        return await queryBuilder
            .orderBy('coleta.bairro', 'ASC')
            .addOrderBy('coleta.diaSemana', 'ASC')
            .getMany();
    }

    async findOne(id: number): Promise<Coleta> {
        const coleta = await this.coletaRepository.findOne({ where: { id } });
        if (!coleta) {
            throw new NotFoundException(
                `Registro de coleta com ID ${id} não encontrado`
            );
        }
        return coleta;
    }

    async update(
        id: number,
        updateColetaDto: UpdateColetaDto
    ): Promise<Coleta> {
        const coleta = await this.findOne(id);
        Object.assign(coleta, updateColetaDto);
        return await this.coletaRepository.save(coleta);
    }

    async remove(id: number): Promise<void> {
        const coleta = await this.findOne(id);
        await this.coletaRepository.remove(coleta);
    }

    async getBairrosDisponiveis(): Promise<string[]> {
        const result = await this.coletaRepository
            .createQueryBuilder('coleta')
            .select('DISTINCT coleta.bairro', 'bairro')
            .orderBy('coleta.bairro', 'ASC')
            .getRawMany();

        return result.map((item) => item.bairro);
    }
}
