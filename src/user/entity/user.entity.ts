import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 25, nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 25, nullable: false })
  password: string;
  @Column({ type: 'bool', nullable: false, default: true })
  active: boolean;
}
