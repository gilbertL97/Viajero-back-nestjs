import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import {
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
import { CountryEntity } from '../../country/entities/country.entity';

@Entity('viajeross')
export class TravelerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 150, nullable: false })
  Name: string;
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

  @Column({ type: 'numeric', nullable: true })
  total_amount: number;

  @Column({ type: 'numeric', nullable: true })
  state: number;

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
  @JoinColumn({ name: 'origin_country' })
  origin_country: CountryEntity;

  @ManyToOne(() => CountryEntity, (country) => country.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'nationality' })
  nationality: CountryEntity;

  @ManyToOne(() => CoverageEntity, (country) => country.travelers, {
    eager: true,
  })
  @JoinColumn({ name: 'coverage' })
  coverage: CoverageEntity;

  /* @BeforeInsert() //verificar antes q de insertar q se el passaporte no se repite
  @BeforeUpdate() //y si se repite el pasaporte q tenga un dieferemcia de al menos 2 dias de la fecha de fin de la anterior  async hashPasword() {
  async dontRepeatPassport() {
    
  }*/
}
