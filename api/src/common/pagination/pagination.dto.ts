import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class Pagination {
  @ApiModelPropertyOptional({ description: 'Max number of items or page size.' })
  @Transform((limit: string) => parseInt(limit, 10))
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiModelPropertyOptional({ description: 'Start from offset, requires limit.' })
  @Transform((offset: string) => parseInt(offset, 10))
  @ValidateIf(({ limit }) => limit !== undefined)
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiModelPropertyOptional({ description: 'Page number, requires limit.' })
  @Transform((offset: string) => parseInt(offset, 10))
  @ValidateIf(({ limit }) => limit !== undefined)
  @IsOptional()
  @IsNumber()
  page?: number;
}
