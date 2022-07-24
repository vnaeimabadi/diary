import {createMachine, assign} from 'xstate';
// import {send} from 'xstate/lib/actions';
interface IUserStatus {
  password: string;
  registered: boolean;
  service: string;
  storage: string;
  username: string;
}
export const loginRegisterMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7ABAJzE1gBcw8cBbAQwGMALbMAOnrBoGscBXWM2HElVIBiCKizNsAN1TtmaTLgJFS5avUYs6bTjz4DiQsAmmoaQjOIDaABgC6iUAAdUsDMUtZHIAB6IAtACMNgBMIUwAnADsAGwhABwRMREALADMUfExADQgAJ4BgSk2NkxRaSmBIYFp1fFpMWkAvk25Ctj4hBgkZJS0DBJMyt2qOABmaADuTLB0qJOdKr0UqBBUyMIAYgCSADK7APoAqgDKAKIASgByAIIAsmfeLm4e4t5+CEFpAKwpTN+BRoxGqAlIhX65AqfeLxb5MeJgkIpYG-GLfGEtNroDrDHpqfqaXGjCbzGZzBZE5ardZbPaHAAKNxOJwA6gB5C4AESerncnneAQiIQiTDSWW+MRSmSqCRy+UFNkC-xiNmKIRiWXBUSimJA7SUXTxfQ0g0p5BJ01m80WIypaw2p0utweBwAQrsjhceS9+UhfIVGkryt9vhEfjYIjYVSlIQFpUwQiUkt9YqCYjrWnrsQalviTcwzeMpmTrYWVvbhCcjq67tsACoHC5nADi2xOdcu3r5bz9HyCNni4XqgXiVSjgVDNVjnwlpW+qpSsMlNnRuv1NqN6gGBcNxOLVopu7tNMZzPZXLdHq9fue3a8vYCMWSZXRNiiqUC5XBIWn-m1UTKDJAgiGFgW1EM12zDdRi3Qkj3NYs9DwK4qAoMAzjwPBaX2Y5zmue5HhvXlXnvUA+yqCcE2+DIQLFAFQxjeVPnKEVQMHSVwUXVdM3XMsCVNeCi1JKhJioPksCgC54NEcRJCwGQ5CYXjBNggTcyE6YRLEjwJKk3MTHkswLGsewuxIgVPhqJ9-hCd8wiyYJ02+X8pQAlV1WKeJgxAiCeKgvj8yGQSLSYJwqFgWBJlQPAIAwrCdhw09WQ5bkiJ9HsyMFCpRXSDJ1UHENFV-ZI0gTMEKiyEDkWSSDFGg5Z+PkKCQoPHB13LGkEoZJlkq5MzfUyz40jFUV4ijXLHNHWJfwnRomCc4DPzSQEIlSWqcRUxqlOa-dyTaqCOo2JLz05S9PX6jL-QQYCAJHKJFVqWyU08mb51K0cYRSCI3qqJ91pzW0823ba6pavb2upDYqxresDl2NlWyuC7SKu-wUjhd8lxsBpgOxqcmK+KI-iKepYXRH4ol+f76qBzR1xCsKIqimK4uw7qzxS5GLJ+cJhoSTJlrSCNokYqEgglXmsjRUJI1HEJqYC4H6eLLTxKgXZsxkwZTEU5T1NUprQZV0S1Y1xQDJkcwSNsBw0rvCzhVKsUNTiDVMklGaB3CFJF2KYofnRkCFc2wLleEk2dPVzWyDwaLQuQIQxmiigQY2-WtrDzSI+wKPzdMK3PBtrmHwQBIRRCCo4nuqo5YiGaigxr3gTiIX53l3UsFWOBvD1wHjWB1gOG4Xg8H4QRSGLwagg1cIiYjKNUilCd4hmlUg2+aoVQ3+7kQzLE6sVuD1LB0sVMhyfUeCWz4U8xUpqiWbf3fEVMmo4aSYndHg-TwLCxCpCUJoTikwYgqBUAHBOHMPAxAL7kSFkqVaNRhrJCyGKFeBN0QxH+BvMaxRn5ShiN-PuBsgrH0QiPQB6FMKwMKLUOEiDhoNBAo0GExVQzYISAuCcEYiZEM3FtP+xttI5z0oDGhllAyARDGGeckZowuUjBw3Bb5VoEL4TBARwVixmkgOI6ewFIg+0qLZCIwQFy-j5kwRcK4hRvifICXhfkD4h2BoI0kjNIrRViphEBYDIHRRgXbcyJd-AaiVKiWIkYkhRmor+CUAESg+0jLZB6wF1ENV-lo9x4VPEs2oUEgaqN7pwgickCMKo0RpGKsUJgiSvpRhXAkT86TaZqT7haPRgIQxSNDOGORqpfwi2VNjGEpikhpFWi0-udMdqklahDe0eiRqhjGkKIWb5yqi0KPOOEFdKaSgaDgqUUySGZ1Cjk5m3i8C+NQP46B4j0bxDKAOJIkYfiNEXDNCZ4RJT1ClF7aIA4TkZ1mdMDxlzgHYBoNFAgNBAnOGIoUj4jznmJDKe8iqXyDG-J9uCZI4J6jAtDqC85TMvFxQedle6aK3kSkxQTIoaJ5qLmWpvDId8iVKxJarSOZtsAPPCEiaoz0IwJDFHXBln9anVCFImDIGovKcpmUbUkCgYAQG2CjW8wSp7DSeWKca78oxTTlGLYI6IrG+1VNjX4KylWDEzksuIo1DXLWNZ+U1AYGjzUprNOW6QVz2rAJ0+6WC55yMXg-dEM17oigWnUMMgIJwtBaEAA */
  createMachine(
    {
      context: {userStatus: {} as IUserStatus, userName: '', password: ''},
      tsTypes: {} as import('./loginRegisterMachine.typegen').Typegen0,
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
