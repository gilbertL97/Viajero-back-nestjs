import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RequestEntityLog } from './requestLog.entity';

@Entity()
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false, length: 300 })
  message: string;

  @Column({ type: 'text', nullable: false, length: 100 })
  context: string;

  @Column({ type: 'text', nullable: false, length: 50 })
  level: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => RequestEntityLog, (request) => request.logs)
  request: RequestEntityLog;
}
