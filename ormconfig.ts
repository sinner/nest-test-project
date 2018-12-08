import env from './src/config/env.util';

const databaseConfig = {
    type: env.TYPEORM_CONNECTION || 'postgres',
    host: env.TYPEORM_HOST,
    port: env.TYPEORM_PORT,
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    database: env.TYPEORM_DATABASE,
    synchronize: env.TYPEORM_SYNCHRONIZE,
    entities: [__dirname + '/**/src/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/**/src/migrations/*.entity{.ts,.js}'],
    cli: {
        entitiesDir: 'src/entities',
        subscribersDir: 'src/entities/subscribers',
    },
};

export default databaseConfig;
