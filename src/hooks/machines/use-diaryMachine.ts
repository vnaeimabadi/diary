import {useMachine} from '@xstate/react';
import {queryAllDiaryLists} from '../../../database/allSchemas';
import {
  backup_database,
  restore_database,
} from '../../../screens/helper/backupRestore';
import {diaryMachine} from '../../machines/diaryMachine';

export const useDiaryMachine = () => {
  const [state, send] = useMachine(diaryMachine, {
    services: {
      getDiaryList: async () => {
        const data = await queryAllDiaryLists();
        let finalData = data;
        if (data.length > 0) {
          let sorted = [...data].sort((a, b) => b.year - a.year);
          finalData = [{id: -1}, ...sorted, {id: -2}];
        }

        return finalData;
      },
      backuping: async () => {
        await backup_database();
      },
      restoring: async () => {
        await restore_database();
      },
    },
  });

  return {state, send};
};
