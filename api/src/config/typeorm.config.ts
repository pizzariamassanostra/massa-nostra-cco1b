import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carrega variáveis de ambiente
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      // CONFIGURAÇÕES IMPORTANTES:
      ssl: {
        rejectUnauthorized: false, // Para Supabase
        ca: process.env.DB_SSL_CERT, // Se necessário
      },

      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development', // Cuidado em produção
      logging: process.env.NODE_ENV === 'development',
    }),
    // Outros módulos...
  ],
})
export class AppModule {}
