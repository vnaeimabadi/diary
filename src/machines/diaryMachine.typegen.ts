// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    assignUserStatusToContext: 'done.invoke.diary machine.check users state:invocation[0]';
    assignUserStatusErrorToContext: 'error.platform.diary machine.check users state:invocation[0]';
    assignUserNameInputToContext: 'change username';
    assignPasswordInputToContext: 'change password';
  };
  internalEvents: {
    'done.invoke.diary machine.check users state:invocation[0]': {
      type: 'done.invoke.diary machine.check users state:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.diary machine.check users state:invocation[0]': {
      type: 'error.platform.diary machine.check users state:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkUserStatus: 'done.invoke.diary machine.check users state:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: 'checkUserStatus';
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    checkUserStatus: 'try again';
  };
  eventsCausingGuards: {
    'Is Registered': 'done.invoke.diary machine.check users state:invocation[0]';
    'is Password too Short': 'PASSWORD_BLUR';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'check users state'
    | 'show login component'
    | 'show register component'
    | 'show alert error'
    | 'LoginOrRegister'
    | 'passwordErr'
    | 'passwordErr.tooShort'
    | 'passwordErr.incorrect'
    | {passwordErr?: 'tooShort' | 'incorrect'};
  tags: never;
}
