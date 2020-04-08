import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as sapper from '@sapper/server';

import authenticationMiddleware from './middlewares/authentication';
import { connectDB } from './database';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

connectDB();

const router = app => {
	app.post("/api/menu", authenticationMiddleware);
	app.get("/api/menu", authenticationMiddleware);
	app.get("/api/user", authenticationMiddleware);
	app.patch("/api/user", authenticationMiddleware);
	app.post("/api/menu/:menuId", authenticationMiddleware);
	app.patch("/api/menu/:menuId/:sectionId", authenticationMiddleware);
	app.post("/api/order", authenticationMiddleware);
	app.patch("/api/order/:orderId", authenticationMiddleware);
};

const logger = (req, res, next) => {
	if (req.url.includes("api")) {
		console.log("API request at:" + req.method + "" + req.url);
		if (req.body) {
			console.log("Body:", req.body);
		}
	}
	next();
};

const app = express();

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	cookieParser(),
	bodyParser.urlencoded({ extended: false }),
	bodyParser.json(),
	logger
);

router(app);

app.use(sapper.middleware({
	session: (req, res) => ({
		user: req.user,
		__session: req.cookies.__session
	})
}));

app.listen(PORT, err => {
	if (err) console.log('error', err);
});
