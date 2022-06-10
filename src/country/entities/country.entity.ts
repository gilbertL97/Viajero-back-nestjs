import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TravelerEntity } from '../../traveler/entity/traveler.entity';
@Entity('paises')
export class CountryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 4, nullable: false, unique: true })
  iso2: string;
  @PrimaryColumn({ type: 'varchar', length: 5, nullable: false, unique: true })
  iso: string;
  @Column({ type: 'varchar', length: 250, nullable: true })
  long_name: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  short_name: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  comun_name: string;

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {})
  travelers: TravelerEntity[];
}
