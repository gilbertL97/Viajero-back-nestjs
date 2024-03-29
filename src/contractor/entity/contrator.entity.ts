import { FileEntity } from 'src/file/entities/file.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
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
  @Column({ type: 'varchar', length: 100, nullable: false })
  analysis_number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;
  @Column({ type: 'varchar', length: 35, nullable: true })
  telf: string;
  @Column({ type: 'varchar', length: 250, nullable: true })
  addres: string;
  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  file: string;
  @Column({ type: 'varchar', length: 60, nullable: false })
  poliza: string;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => TravelerEntity, (traveler) => traveler.contractor, {})
  travelers: TravelerEntity[];

  @OneToMany(() => FileEntity, (file) => file.contractor, { nullable: true })
  files: FileEntity[];
  @ManyToMany(() => UserEntity, (user) => user.contractors, {})
  users: UserEntity[];

  total_travelers?: number;
  total_import?: number;
}
