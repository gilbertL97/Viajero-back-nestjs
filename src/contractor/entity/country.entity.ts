import { BaseEntity, Column, Entity } from 'typeorm';
@Entity('clientes')
export class CountryEntity extends BaseEntity {
  id: number;
  @Column({ type: 'varchar', length: 2, nullable: false })
  iso2: string;
  indec: number;
  @Column({ type: 'varchar', length: 3, nullable: false })
  iso: string;
  @Column({ type: 'varchar', length: 250, nullable: false })
  nombre_largo: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_corto: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_comun: string;
}
