import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, ValidateIf } from 'class-validator';

export class Pagination {
  @ApiModelPropertyOptional({ description: 'Max number of items or page size.' })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiModelPropertyOptional({ description: 'Start from offset, requires limit.' })
  @ValidateIf(({ limit }) => limit !== undefined)
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiModelPropertyOptional({ description: 'Page number, requires limit.' })
  @ValidateIf(({ limit }) => limit !== undefined)
  @IsOptional()
  @IsNumberString()
  page?: number;
}
