import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContratorEntity } from './contrator.entity';

@Entity('viajeros')
export class TravelerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'char', length: 10, nullable: false })
  sexo: string;
  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;
  @Column({ type: 'varchar', length: 50, nullable: true })
  correo: string;
  @Column({ type: 'integer', nullable: true })
  tipo_cobertura: number;
  @Column({ type: 'date', nullable: true })
  fecha_venta: Date;
  @Column({ type: 'date', nullable: true })
  fecha_fin_poliza: Date;
  @Column({ type: 'integer', nullable: true })
  cant_dias_alto_riesgo: number;
  @Column({ type: 'integer', nullable: false })
  cant_dias: number;
  @Column({ type: 'numeric', nullable: true })
  importe_dias_alto_riesgo: number;
  @Column({ type: 'numeric', nullable: true })
  importe_dias_cubierto: number;
  @Column({ type: 'numeric', nullable: true })
  importe_total: number;
  @Column({ type: 'integer', nullable: true })
  nacionalidad: number;
  @Column({ type: 'integer', nullable: true })
  pais_origen: number;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ContratorEntity, (contractor) => contractor.traveler, {
    eager: true,
  })
  @JoinColumn({ name: 'contractor' })
  contractor: ContratorEntity;
}
