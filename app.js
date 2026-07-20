import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error('İstediğiniz API rotası bulunamadı.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message,
      detail: app.get('env') === 'development' ? error.stack : null 
    }
  });
});

export default app;