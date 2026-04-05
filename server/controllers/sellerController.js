import jwt from 'jsonwebtoken';
import { isNonEmptyString, isValidEmail, sanitizeEmail, sanitizeString } from '../utils/validation.js';

//login selleer  :   /api/seller/login 
export const sellerLogin = async (req, res)=>{
    try{
        const email = sanitizeEmail(req.body?.email);
        const password = sanitizeString(req.body?.password);
        const sellerEmail = sanitizeEmail(process.env.SELLER_EMAIL);
        const sellerPassword = sanitizeString(process.env.SELLER_PASSWORD);

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.json({ success: false, message: 'Email and password required' });
    }

    if (!isValidEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if(password === sellerPassword && email === sellerEmail){
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('sellerToken',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000,
        })
        return res.json({success: true , message: "Logged In"});
    }else{
      return res.json({success: false , message: 'Invalid credentials'});
    }
    }catch(error){
    console.log(error.message);
    res.json({success: false, message: error.message})
    }
}


//check seller is auth   : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true});
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


//Logout Seller :  /api/seller/logout 
export const sellerLogout = async (req,res)=>{
  try{
     res.clearCookie('sellerToken',{
        httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
     });
     return res.json({success : true ,message: "Logged Out"})
  }catch(error){
     console.log(error.message);
     res.json({success:false,message: error.message});
  }
}