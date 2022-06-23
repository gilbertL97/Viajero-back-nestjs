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
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;
  @Column({ type: 'varchar', nullable: false })
  price: number;
  @Column({ type: 'boolean', nullable: false })
  daily: boolean;
  @Column({ type: 'integer' })
  high_risk: number;
  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp' })
  deleteAt: Date;
  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {
    cascade: true,
  })
  travelers: TravelerEntity[];
}
