import {createMachine, assign} from 'xstate';
import {send} from 'xstate/lib/actions';

export const diaryMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQJYEMBOBPABAWzQGMALFAOzADoSxCBrHAV1jA1h1gBc1OwBiCAHsKlcgDdBdKqky4CJclRr0mLNh268E4wYR4phAbQAMAXUSgADoNgpOBshZAAPRABYAjAFZKHgMwAnAF+ft4ATMYAbB4BADQgWIgAtIFhlAEA7BFhYW4ZGcYAHH5ekQC+ZfEy2PhEpCLKDMys7Fw8-KwYghiUlgA2PABm3XiU1XJ1itTEtE1qrZpg2mQSevZGZk7WtuuOSC6I4ZR+hbkZXgEeRWF+GfGJCElhXml+Ef5uxm+5kTkVVegavJ6lRYMRBAB3HB9QRQcg4QiCPDWChkTh8GFwvZWGx2BxOVwIALGYzHGL+X5ZSLEyL3ZJhamUMI0vxuUoBMIeDIBf4gca1BQiMGQnAYMBwrisBFIlFgNF8MUS3gYLa43YExCFYwZdJuXIBUqRLzc050x4RPyUF43SIZSLavy-QpuXn84FTYVQtB9VicHCdbp8Tg1NBQNDkVU7fH7QluAKULJuNyFDw5DzFDKptxmp5hHXJzO5HKZl6FcqVPmAiaCqgAGVh5AA8hgAErilCSjB8EhoMgwVSsMhoPBgSN44QahD20m3ULGLxeQoBSJ5OIJQ6km6hApcwqLk7J11VgUgyj1rHNttK1jd4i9-uWNCwWAQ7oQMfqmMbryW6lFDnGG4jpeGaVxMiEXLGLu+7OoUR6yCeUznk2rbtp2fAAAoAIIAMo4QA6o2LYACIAPoAEK1gAqi2H7RqAhJBKSATOqyzKBHGP45nmOq-Ccxgcp8Wqsi6FZupMIiPs+r4YBAACiGBdnJAByAAqcktqR2F4YRJF0ROX4IB4WaUIBRrnFk-g5Nm66PMuVqhFuRShMmLwVBWZCCBAcBOOJNbTLMA7qG0vD6diBxGaEVoMpyXjJr8ETzjmgSRFahRagaAR5KE3jwUCEmguCUKYvCiLIsIcqcGFk6ZqlHI3OcvwCSENkPCkmamelAlQX4XyZOWAIIe6QpFaKaHKtK5WolV+zbOO4WEsaqWAamHj2pmGRxmubWpj4tzGsEYR7m83JhHl1anp6ODer6-qKd01WGRalBAZttzzsykQhH4ObGaSX15i13jnMEfjnYhIjIWQl7jawj0MZqIQJiE7Isc6tqtckpQvS8GMci8JaiYN+X+VJL5vgpPScIIgg4eCGAzTiUYGQjkV5pQkRGlB-6stytK2U8SMsZmnhxlEcU8mJx7DVQZMyfJimiGQiKKbQjMgHNn6s1ZqXnGcWVfF4Xx3AL3jxiEK6FJtP5anaZ1S0NBW9E+5OyZT8MRf4xhpHrq6fCUxvJVE6RWx4eqLpceaS8TF2KB7hLPAmuTJqmnIZlmOZuIyi4ZQUbIZM6XjuWUQA */
  createMachine(
    {
      context: {
        userStatus: {},
        errorMessage: undefined as string | undefined,
        userName: '',
        password: '',
      },
      tsTypes: {} as import('./diaryMachine.typegen').Typegen0,
      schema: {
        services: {} as {
          checkUserStatus: {
            data: any;
          };
        },
        events: {} as
          | {
              type: 'login';
            }
          | {
              type: 'register';
            }
          | {
              type: 'change username';
              value: string;
            }
          | {
              type: 'change password';
              value: string;
            }
          | {
              type: 'PASSWORD_BLUR';
            }
          | {
              type: 'ENTER_PASSWORD';
            }
          | {
              type: 'try again';
            },
      },
      initial: 'check users state',
      states: {
        'check users state': {
          invoke: {
            src: 'checkUserStatus',
            onDone: [
              {
                actions: 'assignUserStatusToContext',
                cond: 'Is Registered',
                target: 'show login component',
              },
              {
                actions: 'assignUserStatusToContext',
                target: 'show register component',
              },
            ],
            onError: [
              {
                actions: 'assignUserStatusErrorToContext',
                target: 'show alert error',
              },
            ],
          },
        },
        'show login component': {
          on: {
            login: {
              target: 'LoginOrRegister',
            },
          },
        },
        'show register component': {
          on: {
            register: {
              target: 'LoginOrRegister',
            },
          },
        },
        'show alert error': {
          on: {
            'try again': {
              target: 'check users state',
            },
          },
        },
        LoginOrRegister: {
          on: {
            'change username': {
              actions: 'assignUserNameInputToContext',
            },
            'change password': {
              actions: 'assignPasswordInputToContext',
            },
            PASSWORD_BLUR: {
              cond: 'is Password too Short',
              target: '#diary machine.passwordErr.tooShort',
            },
          },
        },
        passwordErr: {
          initial: 'tooShort',
          states: {
            tooShort: {},
            incorrect: {},
          },
          on: {
            ENTER_PASSWORD: {
              target: 'LoginOrRegister',
            },
          },
        },
      },
      id: 'diary machine',
    },
    {
      guards: {
        'Is Registered': (context, event) => {
          return event.data.registered;
        },
        'is Password too Short': context => {
          return context.password.length < 3;
        },
      },
      actions: {
        assignUserStatusToContext: assign((context, event) => {
          send({
            type: event.data.registered ? 'login' : 'register',
          });
          return {
            userStatus: event.data,
          };
        }),
        assignUserStatusErrorToContext: assign((context, event) => {
          return {
            errorMessage: (event.data as Error).message,
          };
        }),
        assignUserNameInputToContext: assign((context, event) => {
          return {
            userName: event.value,
          };
        }),
        assignPasswordInputToContext: assign((context, event) => {
          return {
            password: event.value,
          };
        }),
      },
    },
  );
