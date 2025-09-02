import { PaginationDto } from 'apps/api-gateway/src/common/dto/pagination.dto';

export class GamesListDto extends PaginationDto {
  team?: string;
  time?: string;
}
