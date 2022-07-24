import {assign, createMachine} from 'xstate';

export const diaryMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQJYEMBOBPABAWzQGMALFAOzADoAbAezVTKgBF1sAZFWAFwGIJaFSuQButANZVUmXARLkqdBuRZssnHglG1CabikEBtAAwBdRKAAOtWCn2CLIAB6IATAA4AnJQDsX4wAsAKwAbADMHiEAjK5BADQgWIgAtFEhQZTpxj5BUZ4hngFRYT4hAL5lCdLY+ESkQtXqXNzs9BCQvABCAIIAwgDSACoA8gCSAHKjg6Pd7I7WtvZkji4IURlhAZ6ergXuJa4BIe4hCUkIqYeUnmGeQWGh22FhxtkVVWq18kIARkTiAFdLKwZBo+AIhNpJJRGl96lQ-oRAcC1GCtGQxLoliZzEgQAs7AZlnjVskQoFru4AmF3KUgq5CiUzikohTNvT1gdPD4fDF3iBYXJ4ZREciQRxmrwwBgMLQMJRLNQ9AAzOV4GGfIUKEX-IHipqabRYok4+Y2QkOEkpPaUWnGIKhXLZdxRZkXMKUVw8kJ+YzuemxAIunz8wV1bXK8hcYiQTq6yxdPpDMaTaazM2LIkrFK3VyZIonKnGMJRALZMJu1JHSjrbLRHzcu5HUOa8NCDBwbhysD6sH8QRUKFSVvfKgdnjd3vNdGYvQmswZi3E0CrQqenyuYw+4v3F0Ot2uCKektpfY8nYM9wtmRw7Xjrsdqc8KUyuUKpXcVUYdVh0eUe+Tqi05GnORgLniBJLNmFy7JQRQMkEASuIGQTcj4bpRC6cHUoUQZekURwBNeNRakIkZkNGABKnZyioiYDCMExTDMcwQeaUFWjBsSejc9zhMcTr2m61K2ukpQPLsDpHFExGyG2w4yAAYnQADuvDMDMlEAJrsKMADKgyLhxK4pDklC3MYnhpBeh7uPslaHAENb+FErmRF4uSybeDRqMptBqZRACiBnDEFRlZpxQTuJ6gR+lshzRFurqJIg3hPH6fhhAUZYBCGlQCiOwqNH5ak9AMACqAAK4WWiZ7plpSvJeBEh63AEDm3DWATxQUITBCUXmkVQ0qyhgADiYDcPoTBxkiQL0cmTFpqxVjsRFdXJOyvi5D4xi1i8rwVilME+PmuUeLt6TdYEeUfDeQ2UCNcrUROGB0WVi2pixNXLs4LKYeZISuMU-rIeEu3xMdyTeHZfghMcHi5UEgQVPlZC0O08B4r+wpKIwqigs0P3QWup4g+kBT2tEDmlM5nivJhmy3Bug3yRqhM8K0DCQMTnGBqJW70kEPKw16lb3Jk+SHry3JRV6OSs3+op6kBPC8xtUVRJ6US7XkHiWQ2pxQ4cp3Urc+SlrlJx+orwrkdGsbxurf0XAGcElDSBs+DS7VQ8j5lFKWQN2fSngurbd40Y+qvcM7qybsYMXels9xHMcvvnEevI+s83W5ntV75TjEZRrAxAvQ+Khxykhxa1lyG0ibcVAxhxxdayuRNqy3URz5SmqdXFyYVrHkNnZwTFnDlauYnVL0lusQ8rlDy98Nr7jZN01QLNyKD8kDrRYHDxU+k6zocdu2UJZdknOeVnA0RReFdqT0YBXtFMHvWHFOTdI+gGborKUFyLDNI3ssqT1XnvDceY7QOlPs6ZK5xNpbDpq8I4XhtjGFcKjMoQA */
  createMachine(
    {
      context: {diaryList: []},
      tsTypes: {} as import('./diaryMachine.typegen').Typegen0,
      schema: {
        services: {} as {
          getDiaryList: {
            data: any;
          };
          backuping: {
            data: void;
          };
          restoring: {
            data: void;
          };
        },
        events: {} as
          | {
              type: 'getDiaryList';
            }
          | {
              type: 'backuping';
            }
          | {
              type: 'restoring';
            }
          | {
              type: 'BACKUP';
            }
          | {
              type: 'RESTORE';
            }
          | {
              type: 'DIARYLIST';
            }
          | {
              type: 'BACKTOINITIAL';
            },
      },
      initial: 'diaryFlow',
      states: {
        loadingDiaryList: {
          invoke: {
            src: 'getDiaryList',
            onDone: [
              {
                actions: 'assignDiaryListToContext',
                target: 'diaryListLoaded',
              },
            ],
          },
        },
        diaryListLoaded: {
          on: {
            BACKTOINITIAL: {
              target: 'diaryFlow',
            },
          },
        },
        backupDiaryList: {
          invoke: {
            src: 'backuping',
            onDone: [
              {
                target: 'finishedBackup',
              },
            ],
            onError: [
              {
                target: 'errorGettingBackup',
              },
            ],
          },
        },
        finishedBackup: {
          on: {
            BACKTOINITIAL: {
              target: 'diaryFlow',
            },
          },
        },
        restoreDiaryList: {
          invoke: {
            src: 'restoring',
            onDone: [
              {
                target: 'finishRestoring',
              },
            ],
            onError: [
              {
                target: 'errorRestoring',
              },
            ],
          },
        },
        finishRestoring: {
          on: {
            BACKTOINITIAL: {
              target: 'diaryFlow',
            },
          },
        },
        diaryFlow: {
          on: {
            DIARYLIST: {
              target: 'loadingDiaryList',
            },
            RESTORE: {
              target: 'restoreDiaryList',
            },
            BACKUP: {
              target: 'backupDiaryList',
            },
          },
        },
        errorGettingBackup: {
          on: {
            BACKTOINITIAL: {
              target: 'diaryFlow',
            },
          },
        },
        errorRestoring: {
          on: {
            BACKTOINITIAL: {
              target: 'diaryFlow',
            },
          },
        },
      },
      id: 'diary machine',
    },
    {
      actions: {
        assignDiaryListToContext: assign((context, event) => {
          return {
            diaryList: event.data,
          };
        }),
      },
    },
  );
