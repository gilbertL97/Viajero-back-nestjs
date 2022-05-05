import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_cobertura')
export class CoverageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;
  @Column({ type: 'varchar', nullable: false })
  precio: number;
  @Column({ type: 'boolean', nullable: false })
  diario: boolean;
}
