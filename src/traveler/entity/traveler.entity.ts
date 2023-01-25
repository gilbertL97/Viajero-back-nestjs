import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ContratorEntity } from '../../contractor/entity/contrator.entity';
import { DateHelper } from 'src/common/date/helper/date.helper';

@Entity('viajeros')
export class TravelerEntity extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;
  @Column({ type: 'char', length: 2, nullable: true })
  sex: string;
  @Column({ type: 'date', nullable: true })
  born_date: Date;
  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true, length: 50 })
  passport: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  flight: string;

  @Column({ type: 'date', nullable: true })
  sale_date: Date;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date_policy: Date;

  @Column({ type: 'integer', nullable: true })
  number_high_risk_days: number;

  @Column({ type: 'integer', nullable: false })
  number_days: number;

  @Column({ type: 'numeric', nullable: true })
  amount_days_high_risk: number;

  @Column({ type: 'numeric', nullable: false })
  amount_days_covered: number;

  @Column({ type: 'numeric', nullable: false })
  total_amount: number;

  @Column({ type: 'boolean', nullable: false, default: 'true' })
  state: boolean;

  @Column({ type: 'varchar', length: 300, nullable: true, unique: true })
  Filename: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ContratorEntity, (contractor) => contractor.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'contractor' })
  contractor: ContratorEntity;

  @ManyToOne(() => CountryEntity, (country) => country.travelers, {})
  @JoinColumn({ name: 'origin_country_id' })
  origin_country: CountryEntity;

  @ManyToOne(() => CountryEntity, (country) => country.travelers, {})
  @JoinColumn({ name: 'nationality_id' })
  nationality: CountryEntity;

  @ManyToOne(() => CoverageEntity, (country) => country.travelers, {})
  @JoinColumn({ name: 'coverage_id' })
  coverage: CoverageEntity;

  @BeforeInsert()
  @BeforeUpdate()
  @AfterLoad() //este metodo actualiza el state
  async verifyStatus() {
    if (DateHelper.dayState(this.end_date_policy) < 0) this.state = false;
    else this.state = true;
  }
  @BeforeInsert()
  makeId() {
    // la llave primaria es el pasaporte + fecha de comienzo +mas la fecha de fin si se repite hay um error
    this.id =
      this.passport +
      new Date(this.start_date).toISOString().slice(0, 10) +
      this.name;
    console.log(this.id);
  }
}
