module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'bcd127',
            database: 'db_delicia_gelada',
            port: 3306,
            charset: 'utf8mb4'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    },

    // ✅ Ambiente de produção (Clever Cloud)
    production: {
        client: 'mysql2',
        connection: {
            host:     process.env.MYSQL_ADDON_HOST,
            user:     process.env.MYSQL_ADDON_USER,
            password: process.env.MYSQL_ADDON_PASSWORD,
            database: process.env.MYSQL_ADDON_DB,
            port:     process.env.MYSQL_ADDON_PORT,
            charset:  'utf8mb4'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
}