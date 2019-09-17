import { ID } from '@datorama/akita';

export interface Base {
  id: ID;
  docId?: string;
  docPath?: string;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
  exists?: boolean;
}
