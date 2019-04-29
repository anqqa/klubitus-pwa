import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional } from 'class-validator';

export class DPagination {
  @ApiModelPropertyOptional({ description: 'Max number of items.' })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiModelPropertyOptional({ description: 'Start from offset.' })
  @IsOptional()
  @IsNumberString()
  offset?: number;
}
