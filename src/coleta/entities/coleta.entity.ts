import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TipoColeta {
    CONVENCIONAL = 'convencional',
    SELETIVA = 'seletiva',
}

export enum DiaSemana {
    DOMINGO = 'domingo',
    SEGUNDA = 'segunda',
    TERCA = 'terca',
    QUARTA = 'quarta',
    QUINTA = 'quinta',
    SEXTA = 'sexta',
    SABADO = 'sabado',
}

@Entity('coletas')
export class Coleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bairro: string;

    @Column({ type: 'varchar' })
    diaSemana: DiaSemana;

    @Column({ type: 'varchar' })
    tipoColeta: TipoColeta;

    @Column()
    horario: string;

    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @Column({ type: 'text', nullable: true })
    tiposResiduos: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
