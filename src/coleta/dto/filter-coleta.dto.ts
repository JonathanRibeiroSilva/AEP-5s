import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoColeta, DiaSemana } from '../entities/coleta.entity';

export class FilterColetaDto {
    @IsOptional()
    @IsString()
    bairro?: string;

    @IsOptional()
    @IsEnum(DiaSemana)
    diaSemana?: DiaSemana;

    @IsOptional()
    @IsEnum(TipoColeta)
    tipoColeta?: TipoColeta;
}
