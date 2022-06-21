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
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContratorEntity } from '../../contractor/entity/contrator.entity';
import { DateHelper } from 'src/common/helper/date.helper';

@Entity('viajeross')
export class TravelerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;
  @Column({ type: 'char', length: 10, nullable: true })
  sex: string;
  @Column({ type: 'date', nullable: true })
  born_date: Date;
  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  passport: string;

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

  @Column({ type: 'numeric', nullable: true })
  amount_days_covered: number;

  @Column({ type: 'numeric', nullable: false })
  total_amount: number;

  @Column({ type: 'boolean', nullable: false })
  state: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ContratorEntity, (contractor) => contractor.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'contractor' })
  contractor: ContratorEntity;

  @ManyToOne(() => CountryEntity, (country) => country.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'origin_country_id' })
  origin_country: CountryEntity;

  @ManyToOne(() => CountryEntity, (country) => country.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'nationality_id' })
  nationality: CountryEntity;

  @ManyToOne(() => CoverageEntity, (country) => country.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'coverage_id' })
  coverage: CoverageEntity;

  /* @BeforeInsert() //verificar antes q de insertar q se el passaporte no se repite
  @BeforeUpdate() //y si se repite el pasaporte q tenga un dieferemcia de al menos 2 dias de la fecha de fin de la anterior  async hashPasword() {
  async dontRepeatPassport() {
    
  }*/
  @BeforeInsert()
  @AfterLoad()
  @BeforeUpdate()
  stateVerifi() {
    const fechaHoy = Date.now();
    if (
      DateHelper.daysDifference(new Date('2022-06-17'), this.end_date_policy) >
      0
    )
      this.state = true;
    else this.state = false;
  }
}
