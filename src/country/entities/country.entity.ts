import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TravelerEntity } from '../../traveler/entity/traveler.entity';
@Entity('pais')
export class CountryEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column({ type: 'varchar', length: 2, nullable: false, unique: true })
  iso2: string;
  @Column({ type: 'varchar', length: 3, nullable: false, unique: true })
  iso: string;
  @Column({ type: 'varchar', length: 250, nullable: true })
  nombre_largo: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  nombre_corto: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_comun: string;

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {})
  travelers: TravelerEntity[];
}
