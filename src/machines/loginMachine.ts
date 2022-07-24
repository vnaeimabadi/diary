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
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7ABAJzE1gBcw8cBbAQwGMALbMAOnrBoGscBXWM2HElVIBiCKizNsAN1TtmaTLgJFS5avUYs6bTjz4DiQsAmmoaQjOIDaABgC6iUAAdUsDMUtZHIAB6IAtACMAJwATEwAbACsNlERAByhERE2NsERADQgAJ4BAOw2AMxMUfEALGWB8TaBEcE28cEAvk1ZCtj4hBgkZJS0DBJMyt2qOABmaADuTLB0qJOdKr0UqBBUyMIAYgCSADK7APoAqgDKAKIASgByAIIAsmfeLm4e4t5+CP5RoWVMITYRQrBeIg2LRLK5T5VeKRMJRMqhcrBPKFQJlPItNroDrDHpqfqaXGjCbzGZzBZE5ardZbPaHAAKNxOJwA6gB5C4AESerncnneAWCwSYAIaZUKhW+8SiyIhAVCNl+lQBQsK8UCEqKmJA7SUXTxfQ0g0p5BJ01m80WIypaw2p0utweBwAQrsjhceS9+UhfAFqoEmGU0vE8grqnVAlE5Z9yiKooEkj84nkQoUytrdVaDeoBswTeMpmTLfmVrbhCcjs67tsACoHC5nADi2xONcunr5bx9H38oW+JVF9UBhVCo9K0Y1EUiZW+gTyyXF6MKGNaOuxeqW+KNef1xMLFopu5tNMZzPZXJdbo9Puena83cQtRsJQi84RNUCisKgOj-mqJRDMpgiiECEjKdVCgzdcs1GHNCSPU1Cz0PArioCgwDOPA8FpfZjnOa57keG9eVee9QB7NVfjCap52A196jKX8ESYFEU1CVEFRA+I1SgxQYOWAljQQgtSSoSYqD5LAoAuBDRHESQsBkOQmEzEtBJ3TcROmMSJI8KSZM3ExFLMCxrHsDtSIFT5ShhPJynA0JgUjApGJyR9uJKb9OPAypJQaXicWEuChM0s0mCcKhYFgSZUDwCBMOwnZcNPVkOW5YivS7ciAk-X4anneM+0qdUkmjYp6hReEUgiMoUgqcUAo3a0t1zFToLCg8cEzUsaSShkmVSrkLO9bKECAgNghnGw7MCOcEhTX94mSEoipBBFX1DQJGv4lrNEzDryS66Ceo2FLz05S93WGrLfQQT9QjyEoExRWqQMmwpFoBSII1qkJ1SFUJtrU7c2r4g7LW66kNgrKtawOXY2WbK5rrI267N+b4UwiT8F2iPJf1fKchSWxIHqW8CttXVSgvU0GOjCiKopiuKEpw-qzzSlGrNmxJIlKGVkUqWqlsW6ImHYupauBGyZyBmmQf2wsdMkqBdnXOTBlMZTqc04L5HapXxJVtXFCMmRzFI2wHAyu9uYTYo2NKSpanYxFfzVKJxeBAppsKWIR3TKnoOB1rFdEo29NV9WyDwWLwuQIQxliig6aa7NabD7SI+wKPTdMC3PCtrmHzu2bhTiIofOd9V4iY8CSn50pURKxyWlXLBVjgbwdeaw1WtYDhuF4PB+EEUhi9Gv9+0qeNpXjQFhd-BjIhsJNQ1HMvA6xPiQ-g0L90OksoYn26gmRJ6YmqNVgjTOpf3uyJJQiRzyhHB6ATl3XafzMLkNQ9CEpMGIKgVABwThzDwMQE+PZ0QBmSHEBM78kiyjcqXZ8MoEgAx+MiJyn9e56yGMJX+w9-4YSwtAgIQFPbwOxqOAoyD8aoOXCUdI9Qwh2WxsEEIW81w73lq1H+htdI5wMs1ChMYaiBmDKGBoKpIzRgVFODBjQwjYLyMiKIeD04g0EaSE0kBxF-kkUGb2YY5FRlQYiAMQE0yJDsqET8IYtGwW-kQwsjNoqxXilhIBIDwGxSgTbSyJc0S2TssBdiI4-ZPwnH7P4M4HHRPRMBBqQc+Ffx0W40kHjmbeLwOIhMvw8jhO+BKdiRQ4jRiiI9NE3xylrVsYDNJgUMkCKyZMQxiRPYmJDGYiMFjIS9mKYGHGjQRy0TSM4gSCsDakk6pDW04j1EBlDPORyz1n7glQUYmEDQOE4wqSiKZu1BiZ3CpFTxLMfHANQP4yBBTETCkrnURUNVUjLgJsBQMwIarLjsl+HhPdtGh1mdMHJXjAHYBoLFAgNBAnOBIiNW6CZGgilvgxN5RRGGDOfuEICIYgRJHFKiY5fc9qgvOUzCF5CglIo+AmMWzyMVBixb+ecMJ8XDlDBURUpKCFnOVpHE22BxG9JfHZOy3ECpu22TOKcvSHEEoetjSCzS04uJmWDQsCgYAQG2KjW8wTRrjSYJNGIM05ohkCO7bGXsQypBRP7H4EQ+UZ1BeI2qj0zXTXVJaha2yb7lz7DEWqYJvwurVTtMlEhOnzhGbPECtRb6122Z+BMK0QIAjiJjFcLQgA */
  createMachine(
    {
      context: {userStatus: {} as IUserStatus, userName: '', password: ''},
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
                  actions: 'assignPasswordInputToContext',
                  target: 'show login modal',
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
