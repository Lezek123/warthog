import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';

import {
  getDatabaseEntityPaths,
  getDatabaseHost,
  getDatabaseLoggingLevel,
  getDatabaseMigrationPaths,
  getDatabaseName,
  getDatabasePassword,
  getDatabasePort,
  getDatabaseSubscriberPaths,
  getDatabaseType,
  getDatabaseUsername,
  shouldSchronizeDatabaseSchema
} from '../utils/configurationManager';

export function getBaseConfig() {
  return {
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    },
    database: getDatabaseName(),
    entities: getDatabaseEntityPaths(),
    host: getDatabaseHost(),
    logger: 'advanced-console',
    logging: getDatabaseLoggingLevel(),
    migrations: getDatabaseMigrationPaths(),
    namingStrategy: new SnakeNamingStrategy(),
    password: getDatabasePassword(),
    port: getDatabasePort(),
    subscribers: getDatabaseSubscriberPaths(),
    synchronize: shouldSchronizeDatabaseSchema(),
    type: getDatabaseType(),
    username: getDatabaseUsername()
  };
}

// Note: all DB options should be specified by environment variables
// Either using TYPEORM_<variable> or WARTHOG_DB_<variable>
export const createDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  const config = {
    ...getBaseConfig(),
    ...dbOptions
  };

  if (!config.database) {
    throw new Error("createConnection: 'database' is required");
  }

  return createConnection(config as any); // TODO: fix any.  It is complaining about `type`
};

// Provide a sort of mock DB connection that will create a sqlite DB, but will expose
// all of the TypeORM entity metadata for us.  Ideally, we'd recreate all of the
// TypeORM decorators, but for now, using this "mock" connection and reading from their
// entity metadata is a decent hack
export const mockDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  return createDBConnection({
    ...dbOptions,
    database: 'warthog.sqlite.tmp',
    synchronize: 'true',
    type: 'sqlite'
  } as any);
};
