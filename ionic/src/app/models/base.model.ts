import { ID } from '@datorama/akita';

export interface Base {
  docId: ID;
  docPath?: string;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
  exists?: boolean;
}
