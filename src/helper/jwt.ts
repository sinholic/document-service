import jwt from 'jsonwebtoken'


function verifyToken(token){
    return jwt.verify(token, process.env.SECRET_KEY)
}

export default verifyToken