import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 300 })
  message: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  context: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  level: string;

  @CreateDateColumn({ type: 'varchar', nullable: false, length: 50 })
  createdAt: Date;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  userAgent: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  requestId: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  ip: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  method: string;
  @Column({ type: 'varchar', nullable: false, length: 100 })
  url: string;
  @Column({ type: 'integer', nullable: true })
  userId?: number;
}
