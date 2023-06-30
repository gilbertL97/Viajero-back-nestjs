import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('archivos')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { nullable: true })
  name: string;
  @CreateDateColumn({ type: 'date' })
  created_at: Date;
  @OneToMany(() => TravelerEntity, (traveler) => traveler.file, {
    cascade: ['remove'],
  })
  travelers: TravelerEntity[];
  @ManyToOne(() => ContratorEntity, (contractor) => contractor.files, {})
  contractor: ContratorEntity;
  @ManyToOne(() => UserEntity, (user) => user.files, {})
  user: UserEntity;
}
