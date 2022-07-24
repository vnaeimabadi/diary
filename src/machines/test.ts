import {assign, createMachine} from 'xstate';

export const test =
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYEl0DoIEMAXfAUXUICcBPAYhIDkAVEgJQH0SBZAQUwBlEoAA4B7VIRQj0gkAA9EAWgCMSgJw4ATKoAsADgDsGgGxrDKgDQgqigKyajABl03d2gMxv32-XoC+vy1QMbDwiUnJqOiZWNgAFbgBlBIB1AHkWABEZUXFJaSQ5RX0HBxw3VVUlR10TRyVtS2sEJTclHG0bDV1PEtUHG29-QLQsXAJiMkpaLl4+NgAhPgBVFmyxFAkpGXkEBQ9dHBUffX0WjSUHJVdGxFa7KqMKmzdnt0edIZAg0dCJiNp4kk0pkFstVgUchs8ttFEYbG1VPpdDptNp+gYjDddkYjGVdEoNBo9E4PIS3J9viFxuEpjQEkt5pxMIw1rktgUdu5Dqdisi9LpjKoNFiCepESp3EY3Bp9EZtEoKSMQvgAO74KHoKAsOCidCwMA0CBSMA4FDoABuIgA1ibKbhVeqJJrtbBdfqEGbLQBjIh5ADaDgAuqyoezQDt8RocM4HKpPKoBkYDFjUaUhTYfEZim4DG5ZYrgva1RqtTqpPqaGAKBQRBQcEIADZEABmtYAtjg7TgHSWXW6wB6LSIfZt0AHgxD1qOYQg5W4cCcM90HDjKqcsQptHGcANXDLPEiNCUbAWfmA2+qGyRq1FmOwZvwQ9OOYhVLoDumkf0VAnk1ZEEoJz2DYjjlNoR4JvUp4hEI+CwLAKq1hA14ULeMSAik6RZJObL5OGihovoO5xk4PiEtocI4hu5RETYcb6G8piOPCJ4BF8Sq4PqFDmigXpgChdIMkyLI4aGeGFLO77RjYiZwu+iLyimUk1KiHR0YiOZGNB6CGsanbEIQtocU+0Ivrs752JcbgOO4nQ4qcSjUVJeiUdZrg+G82j+Gx6AiBAcAyF21KTNQJlhhJezblK-T6J0bwCt0WJAToeZCvKRhHkS2ndsWTqlq65ZgGF4mcioOCPAM5zWZpGhuCm5wLrGTwdISCYaNl56XihOAAEb4BAABi7ZEMVM45tohxZs8VwOC8OaqJi-67A8OB9FmVTgRonTOLoHUXigV7VjgvncF6XoiAAruQo1meNk2xa0uizc8yKLU0CjbmtFWym8DgnKoe1ddWN34Qgv33dNT1za9G5aGmK6PKiAzgWoXlsV2sHwYhFDIUdhAiCICQABa1oQIMRYB85aH0XT4vUaINEtm4EqtZzuO+njGP02WYwhSHdWa53VmAXpk6Jz6g8oDGaBUDi0xKDPUeUrPSji0qXBZaPDIW9ZwXzOMoeTOzKIiMs0++Cs2Ruzy4pU0o1J0DGIrt6McZ2VY8Xxhvi6ZoMeQuhg+CBxg2CUuhYjKdh9CoDvq6jWvsTr3yQNgRsAfUUYc-ocaeL9yIpq00YlA5AoZ2+2lp7shgTeUlTVLUlyM+9jhimcWYogtaP+EAA */
  createMachine(
    {
  context: {email: '' as string, password: '' as string},
  tsTypes: {} as import('./test.typegen').Typegen0,
  schema: {
    services: {} as {
      requestSignIn: {
        data: {};
      };
    },
    events: {} as
      | {
          type: 'password';
          value: string;
        }
      | {
          type: 'email';
          value: string;
        }
      | {
          type: 'ENTER_EMAIL';
          value: string;
        }
      | {
          type: 'ENTER_PASSWORD';
          value: string;
        }
      | {
          type: 'EMAIL_BLUR';
        }
      | {
          type: 'PASSWORD_BLUR';
        }
      | {
          type: 'SUBMIT';
        },
  },
  onDone: {
    actions: 'onAuthentication',
  },
  id: 'signIn',
  initial: 'dataEntry',
  states: {
    dataEntry: {
      on: {
        ENTER_EMAIL: {
          actions: 'cacheEmail',
        },
        ENTER_PASSWORD: {
          actions: 'cachePassword',
        },
        EMAIL_BLUR: {
          cond: 'isBadEmailFormat',
          target: '#signIn.emailErr.badFormat',
        },
        PASSWORD_BLUR: {
          cond: 'isPasswordShort',
          target: '#signIn.passwordErr.tooShort',
        },
        SUBMIT: [
          {
            cond: 'isBadEmailFormat',
            target: '#signIn.emailErr.badFormat',
          },
          {
            cond: 'isPasswordShort',
            target: '#signIn.passwordErr.tooShort',
          },
          {
            target: 'awaitingResponse',
          },
        ],
      },
    },
    awaitingResponse: {
      invoke: {
        src: 'requestSignIn',
        onDone: [
          {
            target: 'signedIn',
          },
        ],
        onError: [
          {
            cond: 'isNoAccount',
            target: '#signIn.emailErr.noAccount',
          },
          {
            cond: 'isIncorrectPassword',
            target: '#signIn.passwordErr.incorrect',
          },
          {
            cond: 'isServiceErr',
            target: 'serviceErr',
          },
        ],
      },
    },
    emailErr: {
      entry: 'focusEmailInput',
      initial: 'badFormat',
      states: {
        badFormat: {},
        noAccount: {},
      },
      on: {
        ENTER_EMAIL: {
          actions: 'cacheEmail',
          target: 'dataEntry',
        },
      },
    },
    passwordErr: {
      entry: 'focusPasswordInput',
      initial: 'tooShort',
      states: {
        tooShort: {},
        incorrect: {},
      },
      on: {
        ENTER_PASSWORD: {
          actions: 'cachePassword',
          target: 'dataEntry',
        },
      },
    },
    serviceErr: {
      entry: 'focusSubmitBtn',
      on: {
        SUBMIT: {
          target: 'awaitingResponse',
        },
      },
    },
    signedIn: {
      type: 'final',
    },
  },
},
    {
      actions: {
        focusEmailInput: () => {
          // work-around: this action is triggered before the button is un-disabled, therefore it wouldn't get focused
          // delay(this.emailInputRef.current.focus())
        },
        focusPasswordInput: () => {
          // delay(this.passwordInputRef.current.focus())
        },
        focusSubmitBtn: () => {
          // delay(this.submitBtnRef.current.focus())
        },
        cacheEmail: assign((ctx, evt) => ({
          email: evt.value,
        })),
        cachePassword: assign((ctx, evt) => ({
          password: evt.value,
        })),
        onAuthentication: () => {
          console.log('user authenticated');
        },
      },
      guards: {
        isBadEmailFormat: ctx => !ctx.email.includes('@'),
        isPasswordShort: ctx => ctx.password.length < 6,
        // isNoAccount: (ctx, evt) => evt.data.code === 1,
        // isIncorrectPassword: (ctx, evt) => evt.data.code === 2,
        // isServiceErr: (ctx, evt) => evt.data.code === 3,
      },
    },
  );
