const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let basicToken
    if (!authToken.toLowerCase().startsWith('basic ')) {
        console.log(1)
        return res.status(401).json({error: 'Missing basic token'})
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
    }

    const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken)
    
    // this moves to the auth-service.js file
    // Buffer
    // .from(basicToken, 'base64')
    // .toString()
    // .split(':')

    if (!tokenUserName || !tokenPassword) {
        console.log(2)
        return res.status(401).json({error: 'Unauthorized request'})
    }

    // req.app.get('db')('thingful_users')
    // .where({user_name: tokenUserName})
    // .first()

    AuthService.getUserWithUserName(
        req.app.get('db'),
        tokenUserName
    )
    .then(user => {
        console.log(tokenUserName)
        if (!user || user.password !== tokenPassword) {
            console.log(3)
            return res.status(401).json({error: 'Unauthorized request'})
        }
        req.user = user
        next()
    })
        .catch(next)
}

module.exports = {
    requireAuth,
}