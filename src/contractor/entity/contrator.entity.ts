import { UserEntity } from 'src/user/entity/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('clientes')
export class ContratorEntity extends BaseEntity {
  @OneToOne(() => UserEntity, { primary: true, cascade: true })
  @JoinColumn({ name: 'id_user' })
  id_user: number;
  @Column({ type: 'varchar', length: 20, nullable: false })
  telf: string;
  @Column({ type: 'varchar', length: 200, nullable: false })
  direc: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  archivo: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  poliza: string;
}
