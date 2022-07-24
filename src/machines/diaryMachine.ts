import {assign, createMachine} from 'xstate';

export const diaryMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQJYEMBOBPABAWzQGMALFAOzADoAbAezVTKgBF1sAZFWAFwGIJaFSuQButANZVUmXARLkqdBuRZssnHglG1CabikEBtAAwBdRKAAOtWCn2CLIAB6IATAHZjlAKzGAHACcrgCMxgDMAcbefn4AbAA0IFiIALTB3gAslBkescbhIX7usWF+AL5lidLY+ESkQtXqXNzs9BCQvABCAIIAwgDSACoA8gCSAHKjg6Pd7I7WtvZkji4IsVnBxZsBfiEergHBickIKe7ulMHBGbEBJe7ert7exRVVarXyQgBGROIArpZWDINHwBEJtJJKI1PvUqL9CACgWpQVoyGJdEsTOYkCAFnYDMtcasUt5YhdybFQu5gmFYiVSsdUldXNlgjFjO4wmF3AEdrc3iAYXI4ZQAGbkLjESCdP6Arp9IZjSbTWbzGwEhzE1LcrzGDIRYKuHKuQK7JmnMk+ULeYIBCJ3Z4ZcqVIUfEUKSgYODcWje4EcZr8QRUSFSd11T3enh+sABpqabSYwnY9WLQkrRBBHw5fIZYJ5Pz6vwW9KxSh042lfx+W23dyC4WRoQSshSgBKPr9KgVAxGEymMzmuPxS0zp1cT0oBzC3jpdNroSiFoNlDiLxKj1iTqpjYjX3DMgAYnQAO68ZgzdsATXYowAyoM05qiaASQ8K5FDrdJ65Sn4wgtFJjQ2QJjCuI04kCW09xkWFPUaE9aHPdsAFFH2GNDnzHbVTiuLwwmMAIHgiCIQkeICwmnc56S5WIYhyIp3FcWCag9Bo1CQ88egGABVAAFbCM1wlIwgyLwdhpQIwknbkAgyIC-wCS4MgyIJbnWOcG0FMhaHaeBcSbA8aDaFR41BIStTfLMNno2l11uKIqUU4pLjA8CAINYiWNdIzRUaUFWgYSBLNfZw3EyNc8m3J5zhiZj3CAudKA0v8aWI6IPAeVjZGbeE5WREFmlC8dST8YJp02cCgiLYi7kUjILgNB0qVU9w4n8HL4JbSVYGlCBZURQESpEl4qNccljCrQ5vHtBIklSZTzmKdYDn8Uowk2Lr2KoaNfX9FFipHDUcOs04qLpTkxtNIoeVmksFoQblsnJb9nk8Wdrm2vLxV64hOxjDAVBGs60j5FLok24s1P1G5SzUqKQKuelHnSMJvuMxCzxB8K8PKtcAheHY-AyXweTiID8LXUnXGMWJYvcRrZwxuEcZJPJvEqzw7VNIjeXmk5RIR9lIjp8r8jAjIKgqIA */
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
