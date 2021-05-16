import express from 'express';
import { getEnv } from '../env';

const PORT = getEnv('PORT') ?? 9698;
const app = express();

app.use(function (req, res, next) {
	console.log('New request: ', { url: req.originalUrl, method: req.method, headers: req.headers });
	console.log('Time: ', new Date().toLocaleString());
	next();
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export default app;
