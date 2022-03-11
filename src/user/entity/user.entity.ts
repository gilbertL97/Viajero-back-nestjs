import { hash } from 'bcryptjs';
import { UserRole } from '../user.role';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @Column({ type: 'bool', nullable: false, default: true })
  active: boolean;
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  role: string;
  @BeforeInsert() // hashear contraseña
  @BeforeUpdate()
  async hashPasword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }
}
