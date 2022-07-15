import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TravelerEntity } from '../../traveler/entity/traveler.entity';

@Entity('tomadores_seguros')
export class ContratorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  client: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;
  @Column({ type: 'varchar', length: 20, nullable: false })
  telf: string;
  @Column({ type: 'varchar', length: 250, nullable: false })
  addres: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  file: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  poliza: string;
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {})
  travelers: TravelerEntity[];

  @ManyToMany(() => UserEntity, (user) => user.contractors, {})
  users: UserEntity[];
}
