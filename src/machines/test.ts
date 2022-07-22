import {assign, createMachine} from 'xstate';

export const test =
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYEl0DoIEMAXfAUXUICcBPAYhIDkAVEgJQH0SBZAQUwBlEoAA4B7VIRQj0gkAA9EAWgCMSgJw4ATKoAsADgDsGgGxrDKgDQgqigKyajABl03d2gMxv32-XoC+vy1QMbDwiUnJqOiZWNgAFbgBlBIB1AHkWABEZUXFJaSQ5RX0HBxw3VVUlR10TRyVtS2sEJTclHG0bDV1PEtUHG29-QLQsXAJiMkpaLl4+NgAhPgBVFmyxFAkpGXkEBQ9dHBUffX0WjSUHJVdGxFa7KqMKmzdnt0edIZAg0dCJiNp4kk0pkFstVgUchs8ttFEYbG1VPpdDptNp+gYjDddkYjGVdEoNBo9E4PIS3J9viFxuEpjQEkt5pxMIw1rktgUdu5Dqdisi9LpjKoNFiCepESp3EY3Bp9EZtEoKSMQvgAO74KHoKAsOCidCwMA0CBSMA4FDoABuIgA1ibKbhVeqJJrtbBdfqEGbLQBjIh5ADaDgAuqyoezQDt8RocM4HKpPKoBkYDFjUaUhTYfEZim4DG5ZYrgva1RqtTqpPqaGAKBQRBQcEIADZEABmtYAtjg7TgHSWXW6wB6LSIfZt0AHgxD1qOYQh4aVzjU4U40Rp+li9locH0cQnThccwqAl8lbgwG31Q2SNWosx2DN+CHpxzEKpdAd00j+ioE8mrIglCc9g2I45TaKuCb1AWPxCPgsCwCqtYQFeFA3jEgIpOkWSTmy+ThooaL6DgNhxk4PiEtocI4uu5SEcReZvKYjjwjYUEhPqFDmigXpgMhdIMkyLLYaGuGFAg8puDgTgOPKnQdFKhJYm4DiEX0KgGM8AqGLorHoIaxqdsQhC2iej7Qs+uxvnYlxKe4nQ4nu1Fvu0NTAUprg+G82j+Ee6AiBAcAyF21KTNQplhqJexxjgUr9PonRvAK3RYoBOh5kK8pGKuRI6d2xZOqWrrlmAYUiZyKjRQmYEtA4OaZW4KbnDgxQVJVnRaJ0OVnheyE4AARvgEAAGLtkQJUzkKEnyjV0oOI4JTnOuQoVTUrQdC8SivJ154oJe1Y4L53Bel6IgAK7kGN5kTe0+4zXNDgLX+uxqMtJjKToxEdO4W3ddWF14QgyLqFNpKzSU91KOu5y4o8NTnBR+g0TVOUwXBCEUEhe2ECIIgJAAFrWhB-RFAESVofRdPi9Rog0j0KPKUaVNK7hvp4xj9MjsHwYhPVmsd1ZgF6hNCU+-3KAjmgVPdb4StT1HlFuZw4jNVzOF5R5dijXPo8hRM7MoiIS+T0tU9J67PLijMynFLlxeS6snp2VacdxOvC2Z-0eU1hg+MBxg2CUuhYjKdiqVccLKyiOXfJA2C6-+9RRiz+hxp4bxOKoKatNGJR7gKCevjpce7IY2hlBUVROLUlw000CiOGKZyuDY8LIl03m+EAA */
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
