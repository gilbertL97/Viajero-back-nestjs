import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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
}
