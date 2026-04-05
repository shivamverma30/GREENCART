
import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';
import {
	sanitizeBodyStrings,
	validateEmailField,
	validateRequiredFields,
} from '../middlewares/requestValidation.js';

const sellerRouter = express.Router();

sellerRouter.post(
	'/login',
	sanitizeBodyStrings,
	validateRequiredFields(['email', 'password']),
	validateEmailField('email'),
	sellerLogin
);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
sellerRouter.post('/logout',sellerLogout);

export default sellerRouter;