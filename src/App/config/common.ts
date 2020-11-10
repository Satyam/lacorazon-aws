import { db } from 'Firebase';
import { useObjectVal } from 'react-firebase-hooks/database';

export const useConfig = (config: string) =>
  useObjectVal<number>(db.ref(`config/${config}`));

export const useConfigs = () => useObjectVal<ConfigType>(db.ref('config'));
