module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DATABASE_BBDD || 'questionareDB',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [__dirname + '/dist/src/migration/**/*.js'],
  cli: {
    entitiesDir: 'src/**/*.entity{.ts,.js}',
    migrationsDir: 'src/migration',
  },
}
