import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('archivos')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { nullable: false })
  name: string;
  @CreateDateColumn()
  fecha: Date;
  @OneToMany(() => TravelerEntity, (traveler) => traveler.file, {})
  travelers: TravelerEntity[];
}
