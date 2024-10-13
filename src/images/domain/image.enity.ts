import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'images' })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the file entity',
    example: 'a3e95e9c-72be-4d89-a032-abc123def456',
  })
  id: string;

  @Column({ type: 'uuid' })
  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: 'a3e95e9c-72be-4d89-a032-abc123def456',
  })
  tenant_id: string;

  @Column()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'c3e95e9c-72be-4d89-a032-abc123def456',
  })
  user_id: number;

  @Column()
  @ApiProperty({
    description: 'Name of the folder where the file is stored',
    example: 'documents',
  })
  folder_name: string;

  @Column()
  @ApiProperty({
    description: 'Full path of the file in the storage system',
    example: '/documents/reports/2024/',
  })
  folder_path: string;

  @Column()
  @ApiProperty({
    description: 'Name of the file',
    example: 'report.pdf',
  })
  file_name: string;

  @Column()
  @ApiProperty({
    description: 'URL to access the file',
    example: 'https://example.com/documents/reports/2024/report.pdf',
  })
  url: string;
}
