// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    assignDiaryListToContext: 'done.invoke.diary machine.loadingDiaryList:invocation[0]';
  };
  internalEvents: {
    'done.invoke.diary machine.loadingDiaryList:invocation[0]': {
      type: 'done.invoke.diary machine.loadingDiaryList:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    getDiaryList: 'done.invoke.diary machine.loadingDiaryList:invocation[0]';
    backuping: 'done.invoke.diary machine.backupDiaryList:invocation[0]';
    restoring: 'done.invoke.diary machine.restoreDiaryList:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: 'getDiaryList' | 'backuping' | 'restoring';
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    getDiaryList: 'DIARYLIST';
    backuping: 'BACKUP';
    restoring: 'RESTORE';
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | 'loadingDiaryList'
    | 'diaryListLoaded'
    | 'backupDiaryList'
    | 'finishedBackup'
    | 'restoreDiaryList'
    | 'finishRestoring'
    | 'diaryFlow'
    | 'errorGettingBackup'
    | 'errorRestoring';
  tags: never;
}
