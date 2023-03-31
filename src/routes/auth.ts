import { Router } from 'express';

import api from '../api/auth';

const authRoute: Router = Router();

authRoute.post('/register', api.registerUser);


export default authRoute;
