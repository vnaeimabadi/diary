// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    assignUserStatusToContext: 'done.invoke.login register machine.check users state:invocation[0]';
    assignUserStatusErrorToContext: 'error.platform.login register machine.check users state:invocation[0]';
    assignUserNameInputToContext: 'FILL_USERNAME';
    assignPasswordInputToContext: 'FILL_PASSWORD';
  };
  internalEvents: {
    'done.invoke.login register machine.check users state:invocation[0]': {
      type: 'done.invoke.login register machine.check users state:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.login register machine.check users state:invocation[0]': {
      type: 'error.platform.login register machine.check users state:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkUserStatus: 'done.invoke.login register machine.check users state:invocation[0]';
    register: 'done.invoke.login register machine.register flow.awaitingRegister:invocation[0]';
    login: 'done.invoke.login register machine.login flow.awaitingLogin:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: 'checkUserStatus' | 'register' | 'login';
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    checkUserStatus: 'try again';
    register: 'SUBMIT_REGISTER';
    login: 'SUBMIT_LOGIN';
  };
  eventsCausingGuards: {
    'Is Registered': 'done.invoke.login register machine.check users state:invocation[0]';
    is_username_shot: 'USERNAME_BLUR' | 'SUBMIT_REGISTER';
    is_password_shot: 'SUBMIT_REGISTER' | 'PASSWORD_BLUR' | 'SUBMIT_LOGIN';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'check users state'
    | 'show alert error'
    | 'register flow'
    | 'register flow.show register modal'
    | 'register flow.userNameErr'
    | 'register flow.userNameErr.too_Short'
    | 'register flow.awaitingRegister'
    | 'register flow.registered'
    | 'register flow.passwordErr'
    | 'register flow.passwordErr.tooShort'
    | 'login flow'
    | 'login flow.show login modal'
    | 'login flow.passwordErr'
    | 'login flow.passwordErr.tooShort'
    | 'login flow.passwordErr.incorrect'
    | 'login flow.awaitingLogin'
    | 'login flow.loggedIn'
    | {
        'register flow'?:
          | 'show register modal'
          | 'userNameErr'
          | 'awaitingRegister'
          | 'registered'
          | 'passwordErr'
          | {userNameErr?: 'too_Short'; passwordErr?: 'tooShort'};
        'login flow'?:
          | 'show login modal'
          | 'passwordErr'
          | 'awaitingLogin'
          | 'loggedIn'
          | {passwordErr?: 'tooShort' | 'incorrect'};
      };
  tags: never;
}
