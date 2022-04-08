import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

export class TravelerEntity extends BaseEntity {
  //id_cliente
  @Column({ type: 'char', length: 10, nullable: false })
  sexo: string;
  @Column({ type: 'date', nullable: false })
  fecha_nacimiento: Date;
  @Column({ type: 'varchar', length: 50, nullable: false })
  correo: string;
  @Column({ type: 'integer', nullable: false })
  tipo_cobertura: number;
  @Column({ type: 'date', nullable: false })
  fecha_venta: Date;
  @Column({ type: 'date', nullable: false })
  fecha_fin_poliza: Date;
  @Column({ type: 'integer', nullable: false })
  cant_dias_alto_riesgo: number;
  @Column({ type: 'integer', nullable: false })
  cant_dias: number;
  @Column({ type: 'numeric', nullable: false })
  importe_dias_alto_riesgo: number;
  @Column({ type: 'numeric', nullable: false })
  importe_dias_cubierto: number;
  @Column({ type: 'numeric', nullable: false })
  importe_total: number;
  @Column({ type: 'integer', nullable: false })
  nacionalidad: number;
  @Column({ type: 'integer', nullable: false })
  pais_origen: number;
}
