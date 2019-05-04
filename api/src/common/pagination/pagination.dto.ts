import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class Pagination {
  @ApiModelPropertyOptional({ description: 'Max number of items or page size.' })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiModelPropertyOptional({ description: 'Start from offset. Requires limit, conflicts offset.' })
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiModelPropertyOptional({ description: 'Page number. Requires limit, conflicts offset.' })
  @IsOptional()
  @IsNumberString()
  page?: number;
}
