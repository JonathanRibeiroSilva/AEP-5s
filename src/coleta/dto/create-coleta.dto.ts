import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { TipoColeta, DiaSemana } from '../entities/coleta.entity';

export class CreateColetaDto {
    @IsString()
    @IsNotEmpty()
    bairro: string;

    @IsEnum(DiaSemana)
    diaSemana: DiaSemana;

    @IsEnum(TipoColeta)
    tipoColeta: TipoColeta;

    @IsString()
    @IsNotEmpty()
    horario: string;

    @IsString()
    @IsOptional()
    observacoes?: string;

    @IsString()
    @IsOptional()
    tiposResiduos?: string;
}
