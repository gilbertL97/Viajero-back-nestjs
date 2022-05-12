import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('pais')
export class CountryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 2, nullable: false })
  iso2: string;
  indec: number;
  @Column({ type: 'varchar', length: 3, nullable: false })
  iso: string;
  @Column({ type: 'varchar', length: 250, nullable: true })
  nombre_largo: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  nombre_corto: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_comun: string;
}
