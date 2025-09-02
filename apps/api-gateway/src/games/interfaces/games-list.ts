import { PaginationMetadata } from '@app/common/types/common';
import { Game } from '@app/common/types/game';

export interface GamesList {
  data: Game[];
  pagination: PaginationMetadata;
}
