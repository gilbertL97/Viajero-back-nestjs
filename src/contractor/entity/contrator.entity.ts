import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class ContratorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  client: string;
  @Column({ type: 'varchar', length: 20, nullable: false })
  telf: string;
  @Column({ type: 'varchar', length: 250, nullable: false })
  addres: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  file: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  poliza: string;
}
