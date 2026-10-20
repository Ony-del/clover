import { defineMvuDataStore } from '../../../util/mvu';
import { Schema } from './schema';

export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});

export type MvuData = z.infer<typeof Schema>;
