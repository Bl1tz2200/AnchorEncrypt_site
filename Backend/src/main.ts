import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pool } from "./db"
import { config } from 'dotenv';
config()

const frontEndAddresses = ["http://localhost"] // You can add here frontend's ip addresses to add them into cors origin

export const mineIpAddress = `http://localhost:${process.env.PORT}` // Exports backend's ip (ip, on which hosted this code)

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({ // Write cors policy
    origin: "*", // Allowed origins (add frontEndAddresses to increase security)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: false, // Allow credentials (e.g., cookies)
    allowedHeaders: '*', // Allowed headers
  });

  pool.query('SELECT NOW()', (err, res) => { // Connecting to db
    if(err) {
      console.error('Error connecting to the database', err.stack);
    } else {
      console.log('Connected to the database:', res.rows);
    }
  });

  await app.listen(process.env.PORT || 8080); // Run backend
}
bootstrap();
