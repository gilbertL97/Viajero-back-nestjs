import { from } from 'rxjs';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class ContratorEntity extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: false, unique: true })
  idUsuario: number;
  @Column({ type: 'varchar', length: 20, nullable: false })
  telf: string;
  @Column({ type: 'varchar', length: 200, nullable: false })
  addres: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  file: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  poliza: string;
}
