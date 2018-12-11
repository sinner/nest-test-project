import env from './src/config/env.util';

const databaseConfig = {
    type: env.TYPEORM_CONNECTION || 'postgres',
    host: env.TYPEORM_HOST,
    port: parseInt(env.TYPEORM_PORT, 10),
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    database: env.TYPEORM_DATABASE,
    synchronize: (!!env.TYPEORM_SYNCHRONIZE || true),
    logging: ["query", "error", "schema", "warn", "log", "info"],
    entities: [__dirname + '/**/src/entities/*.entity{.ts,.js}'],
    subscribers: [__dirname + '/**/src/entities/subscribers/*.subscriber{.ts,.js}'],
    migrations: [__dirname + '/**/src/migrations/*{.ts,.js}'],
    cli: {
        entitiesDir: 'src/entities',
        subscribersDir: 'src/entities/subscribers',
    },
};

export default databaseConfig;
