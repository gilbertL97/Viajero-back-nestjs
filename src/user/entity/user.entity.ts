import { hash } from 'bcryptjs';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { FileEntity } from 'src/file/entities/file.entity';

@Entity('usuarios')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 300, nullable: false, select: false }) //esto es para no retornar el dato
  password: string;
  @Column({ type: 'varchar', length: 400, nullable: true, select: false }) //esto es para no retornar el dato
  refresh_token: string;
  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  role: string;
  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp' })
  deleteAt: Date;

  @ManyToMany(() => ContratorEntity, (contractor) => contractor.users, {})
  @JoinTable({
    name: 'usuarios_tomadores_de_seguro',
  })
  contractors: ContratorEntity[];
  @OneToMany(() => FileEntity, (file) => file.user, { nullable: true })
  files: FileEntity[];

  @BeforeInsert() // hashear contraseña
  @BeforeUpdate()
  async hashPasword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }
}
