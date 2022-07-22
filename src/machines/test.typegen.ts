// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    onAuthentication: 'done.state.signIn';
    cacheEmail: 'ENTER_EMAIL';
    cachePassword: 'ENTER_PASSWORD';
    focusEmailInput: 'xstate.init';
    focusPasswordInput: 'xstate.init';
    focusSubmitBtn: 'error.platform.signIn.awaitingResponse:invocation[0]';
  };
  internalEvents: {
    'error.platform.signIn.awaitingResponse:invocation[0]': {
      type: 'error.platform.signIn.awaitingResponse:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    requestSignIn: 'done.invoke.signIn.awaitingResponse:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: 'requestSignIn';
    guards: 'isNoAccount' | 'isIncorrectPassword' | 'isServiceErr';
    delays: never;
  };
  eventsCausingServices: {
    requestSignIn: 'SUBMIT';
  };
  eventsCausingGuards: {
    isBadEmailFormat: 'EMAIL_BLUR' | 'SUBMIT';
    isPasswordShort: 'PASSWORD_BLUR' | 'SUBMIT';
    isNoAccount: 'error.platform.signIn.awaitingResponse:invocation[0]';
    isIncorrectPassword: 'error.platform.signIn.awaitingResponse:invocation[0]';
    isServiceErr: 'error.platform.signIn.awaitingResponse:invocation[0]';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'dataEntry'
    | 'awaitingResponse'
    | 'emailErr'
    | 'emailErr.badFormat'
    | 'emailErr.noAccount'
    | 'passwordErr'
    | 'passwordErr.tooShort'
    | 'passwordErr.incorrect'
    | 'serviceErr'
    | 'signedIn'
    | {
        emailErr?: 'badFormat' | 'noAccount';
        passwordErr?: 'tooShort' | 'incorrect';
      };
  tags: never;
}
