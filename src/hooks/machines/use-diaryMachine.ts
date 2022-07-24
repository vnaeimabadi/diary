import {useMachine} from '@xstate/react';
import {queryAllDiaryLists} from '../../../database/allSchemas';
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
      backuping: async () => {},
      restoring: async () => {},
    },
  });

  return {state, send};
};
