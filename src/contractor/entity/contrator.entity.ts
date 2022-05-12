import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TravelerEntity } from '../../traveler/entities/traveler.entity';

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

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {
    cascade: true,
  })
  travelers: TravelerEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];
}
