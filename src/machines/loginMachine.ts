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
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7ABAJzE1gBcw8cBbAQwGMALbMAOnrBoGscBXWM2HElVIBiCKizNsAN1TtmaTLgJFS5avUYs6bTjz4DiQsAmmoaQjOIDaABgC6iUAAdUsDMUtZHIAB6IAtACMNgBMIUwAnADsAGwhABwRMREALADMUfExADQgAJ4BgSk2NkxRaSmBIYFp1fFpMWkAvk25Ctj4hBgkZJS0DBJMyt2qOABmaADuTLB0qJOdKr0UqBBUyMIAYgCSADK7APoAqgDKAKIASgByAIIAsmfeLm4e4t5+CEFpAKwpTN+BRoxGqAlIhX65AqfeLxb5MeJgkIpYG-GLfGEtNroDrDHpqfqaXGjCbzGZzBZE5ardZbPaHAAKNxOJwA6gB5C4AESerncnneAQiIQiTDSWW+MRSmSqCRy+UFNkC-xiNmKIRiWXBUSimJA7SUXTxfQ0g0p5BJ01m80WIypaw2p0utweBwAQrsjhceS9+UhfIVGkryt9vhEfjYIjYVSlIQFpUwQiUkt9YqCYjrWnrsQalviTcwzeMpmTrYWVvbhCcjq67tsACoHC5nADi2xOdcu3r5bz9HyCNni4XqgXiVSjgVDNVjnwlpW+qpSsMlNnRuv1NqN6gGBcNxOLVopu7tNMZzPZXLdHq9fue3a8vYCMWSZXRNiiqUC5XBIWn-m1UTKDJAgiGFgW1EM12zDdRi3Qkj3NYs9DwK4qAoMAzjwPBaX2Y5zmue5HhvXlXnvUA+yqCcE2+DIQLFAFQxjeVPnKEVQMHSVwUXVdM3XMsCVNeCi1JKhJioPksCgC54NEcRJCwGQ5CYXjBNggTcyE6YRLEjwJKk3MTHkswLGsewuxIgVPiKYCmECYJExSYoIjDMNfwBNImGBCpokHN8hWaHioL4-MhkEi0mCcKhYFgSZUDwCAMKwnYcNPVkOW5IifR7MjBQqUV0gydVBxDRVf2SdykRCCoshA5FkkgxRoOWfj5CgsKDxwddyxpJKGSZVKuTM31ss+NIxVFeIo3y4INU-OUoSCCV3PTAEIk-NJASclJ6pxFTmqU1r93JDqoK6jYUvPTlL09Qasv9BBgIAkcokVWoQiiFNiniX8JxsdzRxhFIInndb1Ribac1tPNt32hq2qOzrqQ2Ksa3rA5djZVsrhu0i7v8FI4XfJdfuBSN1rSb6Mj+Ip6lhdEfneraAoaoLofXMKIqimK4oS7DerPNLsYsn5wlGhJMjJiNokY+aJzican3nYUByqcHGqhzQ2eLLTxKgXZsxkwZTEU5T1NUlrYa10Sdb1xQDJkcwSNsBwMrvCzhXcsUNTiDVMklb6B3CByEVVX7flDeJVZZjWDuEq2dN1-WyDwWLwuQIQxliigYZ2029s12PtOwBPbdMB3PCdwWHwQBIRUq5E3sVBIqgib6igJgPgTiNIV1CFpMywVY4G8E3IeNaHWA4bheDwfhBFISvhqCDVwiiRyo1SKUJy+pil8VF9qhVb4G+RDMsWZ3bgsLOHSxUxGF9xuyAODiaR0-KJZd-d8RUyajRupid8aRwvtDK+iFp4oTQglJgxBUCoAOCcOYeBiD33It3JUTkaijWSFkMU295rohiP8I+E1ihfylGDJmOdR5mxCupMKSEIHoUwigwotQ4QYNGg0ECjQYSlVDEQpuGocG2UCEA3Ol9QqW0LrpeCLDLKBkAiGMM85IzRl-IDOcxCQ5kNiGI6he1QGkjNJAORS91qKNDOGVRqp1GUTRHERMR8m5ZFPlmc+4iQGSNJBzaKsV4qYWgbAhBsVkEu3MlXfwM1-gn2SBGFUaJyY7wlABEoDlIwNxBBEPRm4DFeOmD4rm-i8CmOenCVEsRIxJCjNRUqxQmCpOBm+SUQNGZnyoTkiRdCpimMBCGCxyiIxRhsTvKWypVQAKFHEFWlCIYdNZjHS08MTp3zCUNXGY1w4RkqiUVeddvrzjhJVd6koGjEKlNkmCecFnhUir47mASYGoGCUguR+N4hlAHEkUmi1FwUyFB5RcFRnqDmiAOC5TVgr53ybcwpUDsA0FigQGgoTnDETWR8N5HzEixJ+I0X5O9MkAoRGCCUQo6bgvVoMKFNzOZ+ISq83KwKvmhzxXgwoyI4SSnqOHRIo0HIUrHtHC2BdrbZleeECqE5V5bJpi3AlAD6nVCFImDIQjXEjzmUKjoYUFAwAgNsHGt5wmL1Gu8sUk0-5RlHLEf26ImBB2KMUH4+MQICpoVC0xDQRYTROetK1s1vpAg8u9ey1EfX+TabMy5+YenPUIdK1RG937om+s9EUy0Jw0S9rCPuTQgA */
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
