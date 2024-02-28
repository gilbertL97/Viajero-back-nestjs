import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LogEntity } from './loggin.entity';

@Entity()
export class RequestEntityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  user: string;

  @Column({ type: 'text', nullable: false, length: 200 })
  url: string;

  @Column({ type: 'text', nullable: false, length: 200 })
  method: string;

  @Column({ type: 'text', nullable: false, length: 100 })
  userAgent: string;

  @Column({ type: 'text', nullable: false, length: 30 })
  ipAddress: string;

  @OneToMany(() => LogEntity, (log) => log.request)
  logs: LogEntity[];
}
