import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cobertura')
export class CoverageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;
  @Column({ type: 'numeric', nullable: false })
  price: number;
  @Column({ type: 'boolean', nullable: false })
  daily: boolean;
  @Column({ type: 'numeric', default: 2 })
  high_risk: number;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {
    cascade: true,
  })
  travelers: TravelerEntity[];
}
