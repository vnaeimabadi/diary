import {createMachine, assign} from 'xstate';
// import {send} from 'xstate/lib/actions';
interface IUserStatus {
  password: string;
  registered: boolean;
  service: string;
  storage: string;
  username: string;
}
export const loginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7ABAJzE1gBcw8cBbAQwGMALbMAOnrBoGscBXWM2HElVIBiCKizNsAN1TtmaTLgJFS5avUYs6bTjz4DiQsAmmoaQjOIDaABgC6iUAAdUsDMUtZHIAB6IALP4AbEwAjADMQeEArACcABz+odHhsUEANCAAnogAtKkATEzRoUEFNgWxNqGViQC+dZkK2PiEGCRklLQMElo63Lx4-IIiZHioeExOyEIAZhMUTM1KbR1q3ZqsHAP6I8am5h7W9t4ubkdeSL6IyUXh8QX+AOxxoTYP4U+ZOQi5BdF3coRfw2cIFR5lAoNJroFrKdqqLoaXqwOioADuOCoyDIxBwYwmwmIeCyWKgVGwp1c7k83j8vziTCCT3u8TKKXKTyCoW+eVqYRBBUi0Wiz3icXC0JAy1aKk66h6zHhaxwszQ6KYqIxsoR8tQEGxwgAYgBJAAyZoA+gBVADKAFEAEoAOQAggBZe1U860q703KhGpMBIVNnMsqhJ6hWK837xJgvGyBWKxfwA2IAuJSmXKxEKzS5zpqjGatGYwtqfWG00Wy0ABVdtttAHUAPKOgAi3pp4jpiHCQdC-gzNgS0XisSeaVjf38TGCbJsQWeQQnIPi2dhKzl62RStWiOLGq15YPeoNyGEdqdbs9loAQmbrY7uxc+79UjYwimSvE2X+ARsL5skQDMmAnd5wiTZ4o1XJ5N0UHUVXzXoK1VdVS21NCKCrS9bWte93RNAAVS1HXtABxE1bWIp1X19UB6WSeMniTAp2SeNlSheWMBxCccWTeaI4PiSIELhM9d0VJg0KPTDTx3ShcOEBsmzbTsHyfF8rjOHtLkYxBoijBMninDNwQKP9wljFMmBiNNJ3CZ5x3id5xO3XUpILST0JLPQ8GdKgKDAe08DwY1zSta8XQ9L0dOpN8-UQdimEs8EuX+aIkzXWMIieVKkzSSdRPiUzRPcpC8w2VCfLkqh0QpDwsCgR1CDcNZRHESQsBkOQli3Sr5Wq-dFLqhqaWa1qoHa1QTB6swLGOBx4p9XskoQe45yFOJYk+AoXkiApYziL83heUUuKqYSKuw4aZNqjCnCoWBYHRCYIFC8KaytVSW3bLsVr098oPy6N9uqDMuXHHkQIQUJRPA4dAheN4JyCIJohunyUPkAa5JPHAZRwi8ItrX71IB5wEoY64EF2-LWLeJJLKXcdohnGJTtTFHxQSJzMcaaUBtuvd+sQ-Gy0JgbicNcn-s0596LWgy4eecJUtXIJivh2IhyO2G-iqOzNtHKIam5IIscUnGxZaCXtSJ5T8MIkjLTNVsqOdJX9NpmooNS0San8cFU0+GGfgDIIv3Rqc0yjSMhMtwWc2xu6ZTkp6XrevAPrC0mfsbP7O2999Sks+ch2EypoP8Dn-HjKoIyTHXgjSK3PKRaT04w+rGuwKAzS3TrelMPqU+ttO8Z78amoHrc5pkQ5PFsZaqdWn2mOE2J51XUUnn22JykCXKByYUFyhiUTlxsEok5hRCRa7qeS17ia58UYQCUmaY5gWW2POQpPcW08+7NUHooBeC0LgrxLutZIGM7KlAHKUZuKRYzMhMgUSMDx67xCHNyBogssD6jgN4ceHcbZbF0IMYYhhSCwJVhEUIxR2JYIupCGwN8OZpGKH+UccQ1aBgFvfCSE9RYE2xLifEYUJgMNpgGVITJOGcOZEkVinDa4G3hiESMSQ-xRjSDfCI7dAGi1khhAm2FcJyPpFg9WWsAT7weI8Q+-hrKw1MnZJcwQoLcnKLrfwJiqpmIen5QYgVgqfSYMQVAqBLS2jRHgYgNi8hR3nCKf4V1EhQVSLGauxR7gpiwZUJIUdAnJ2FqnEJo0ML+QiSFMKKS4xzjTJmLJbjQQxlhlg-KKQqgVHhlBEUwQglDWqR3MaoCWptU8k03ICRvzpSiJxRIgljrBHnBDQM0ZVzVHghUh+VTpLmJLMoc4ZBIBNLiEUG+LIo6wSeIETRPxxz2KAiURuUZRTlJEQA4JxzQkakzq9d6USYmoASRMZJgNEoqxFNvBIu0b7fL1l0n4A4vzvBZDfXah8+L7N+YNLyNUaklmBdnXOeArkxGDBOIZKLg5ouSp8M+pV2L7wOlEBIoziUjQmeqOZSQ5zRgzPDf84pOQzknDvNk4IMZGTZjyzumhu4lgJo7C8TS-b5XrjEQ+1c4jxBnJUZhLwoyPGHE5aMBKhaHLEU-YBZLnogpzmC2JkKklapZHOKcrNDpa0ecBCOkZt7cSqPvbZOKlU21VUC51FKonYBoBMAgNBoVryBnA71CZG4pDKAG54M43g6N2RUANqQnKxGjUAu2j142gsaTCmmTEoxfl9Rjf1k5C0G3+EUMNSYMYQjNdW0WsamCv1nuAykTbla+wHPGMEm1ygqMePrF5280zimwVajKVaDmiIoTW3AckFAwAgNOjNsLfYvBCJ8RdTk8FglTLlSMJlXKmS5Lgzikp91-LGQ62tGImm63VozZuLMMbihnMHdW0ZnLMjSNan9hLH6MEFfcb8oq-yrglUBaDPC4NckjGCYS1RCF1CAA */
  createMachine(
    {
      context: {
        userStatus: {} as IUserStatus,
        errorMessage: undefined as string | undefined,
        userName: '',
        password: '',
      },
      tsTypes: {} as import('./loginMachine.typegen').Typegen0,
      schema: {
        services: {} as {
          checkUserStatus: {
            data: IUserStatus;
          };
          register: {
            data: void;
          };
          login: {
            data: void;
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
              type: 'PASSWORD_BLUR';
            }
          | {
              type: 'ENTER_PASSWORD';
            }
          | {
              type: 'ENTER_USERNAME';
            }
          | {
              type: 'USERNAME_BLUR';
            }
          | {
              type: 'SUBMIT_LOGIN';
            }
          | {
              type: 'try again';
            }
          | {
              type: 'FILL_USERNAME';
              value: string;
            }
          | {
              type: 'FILL_PASSWORD';
              value: string;
            }
          | {
              type: 'SUBMIT_REGISTER';
            }
          | {
              type: 'ENTER_USERBANE';
            },
      },
      id: 'login register machine',
      initial: 'check users state',
      states: {
        'check users state': {
          invoke: {
            src: 'checkUserStatus',
            onDone: [
              {
                actions: 'assignUserStatusToContext',
                cond: 'Is Registered',
                target: 'login flow',
              },
              {
                actions: 'assignUserStatusToContext',
                target: 'register flow',
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
        'show alert error': {
          on: {
            'try again': {
              target: 'check users state',
            },
          },
        },
        'register flow': {
          initial: 'show register modal',
          states: {
            'show register modal': {
              on: {
                FILL_USERNAME: {
                  actions: 'assignUserNameInputToContext',
                },
                FILL_PASSWORD: {
                  actions: 'assignPasswordInputToContext',
                },
                USERNAME_BLUR: {
                  cond: 'is_username_shot',
                  target:
                    '#login register machine.register flow.userNameErr.too_Short',
                },
                SUBMIT_REGISTER: [
                  {
                    cond: 'is_username_shot',
                    target:
                      '#login register machine.register flow.userNameErr.too_Short',
                  },
                  {
                    cond: 'is_password_shot',
                    target:
                      '#login register machine.register flow.passwordErr.tooShort',
                  },
                  {
                    target: 'awaitingRegister',
                  },
                ],
                PASSWORD_BLUR: {
                  cond: 'is_password_shot',
                  target:
                    '#login register machine.register flow.passwordErr.tooShort',
                },
              },
            },
            userNameErr: {
              initial: 'too_Short',
              states: {
                too_Short: {},
              },
              on: {
                FILL_USERNAME: {
                  actions: 'assignUserNameInputToContext',
                  target: 'show register modal',
                },
              },
            },
            awaitingRegister: {
              invoke: {
                src: 'register',
                onDone: [
                  {
                    target: 'registered',
                  },
                ],
              },
            },
            registered: {},
            passwordErr: {
              initial: 'tooShort',
              states: {
                tooShort: {},
              },
              on: {
                FILL_PASSWORD: {
                  actions: 'assignPasswordInputToContext',
                  target: 'show register modal',
                },
              },
            },
          },
        },
        'login flow': {
          initial: 'show login modal',
          states: {
            'show login modal': {
              on: {
                FILL_PASSWORD: {
                  actions: 'assignPasswordInputToContext',
                },
                PASSWORD_BLUR: {
                  cond: 'is_password_shot',
                  target:
                    '#login register machine.login flow.passwordErr.tooShort',
                },
                SUBMIT_LOGIN: [
                  {
                    cond: 'is_password_shot',
                    target:
                      '#login register machine.login flow.passwordErr.tooShort',
                  },
                  {
                    target: 'awaitingLogin',
                  },
                ],
              },
            },
            passwordErr: {
              initial: 'tooShort',
              states: {
                tooShort: {},
                incorrect: {},
              },
              on: {
                FILL_PASSWORD: {
                  target: 'show login modal',
                  actions: 'assignPasswordInputToContext',
                },
              },
            },
            awaitingLogin: {
              invoke: {
                src: 'login',
                onDone: [
                  {
                    target: 'loggedIn',
                  },
                ],
                onError: [
                  {
                    target:
                      '#login register machine.login flow.passwordErr.incorrect',
                  },
                ],
              },
            },
            loggedIn: {},
          },
        },
      },
    },
    {
      guards: {
        'Is Registered': (context, event) => {
          return event.data.registered;
        },
        is_password_shot: context => {
          return context.password.length < 3;
        },
        is_username_shot: context => {
          return context.userName.length < 3;
        },
      },
      actions: {
        assignUserStatusToContext: assign((context, event) => {
          // send({
          //   type: event.data.registered ? 'login' : 'register',
          // });
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
