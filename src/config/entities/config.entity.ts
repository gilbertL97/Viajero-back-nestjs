import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ConfigInit')
export class ConfigEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 150, nullable: false })
  key: string;
  @Column({ type: 'varchar', length: 150, nullable: false })
  value: string;
}
