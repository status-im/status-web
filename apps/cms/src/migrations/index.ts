import * as migration_20260528_233905_initial from './20260528_233905_initial';

export const migrations = [
  {
    up: migration_20260528_233905_initial.up,
    down: migration_20260528_233905_initial.down,
    name: '20260528_233905_initial'
  },
];
