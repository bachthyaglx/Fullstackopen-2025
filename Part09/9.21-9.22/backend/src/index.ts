import express from 'express';
import cors from 'cors';
import pingRouter from './routes/ping';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.use("/api/ping", pingRouter);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});