import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
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
  @Column({ type: 'varchar', length: 200, nullable: true, unique: true })
  benefitTable: string;
  @Column({ type: 'numeric', nullable: false })
  price: number;
  @Column({ type: 'boolean', nullable: false })
  daily: boolean;
  @Column({ type: 'numeric', default: 2 })
  high_risk: number;
  @Column({ type: 'integer', nullable: true })
  number_of_days: number;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @Column({ type: 'varchar', nullable: true })
  configString: string;

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {
    cascade: true,
  })
  travelers: TravelerEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  notNumberDaysIfDaily() {
    if (this.daily == false) this.number_of_days = null;
    else if (this.number_of_days == null) this.number_of_days = 30;
  }
}
