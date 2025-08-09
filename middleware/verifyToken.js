import jwt from "jsonwebtoken";



export const Auth = (req, res, next) => {
    const token = req.cookies?.token


    if (!token) return  res.status(401).json({message: "Not authorized"})

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    }catch(err){
        res.status(401).json({message: "token is invalid"})
    }
}