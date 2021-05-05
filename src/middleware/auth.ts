import verifyToken from '../helper/jwt';

function authorization(req, res, next) {
	let { authorization } = req.headers;
	if (authorization) {
		try {
			let decoded = verifyToken(authorization.split(' ')[1]);
			if (decoded) {
				let { iss, iat, exp, aud, sub, company_id, user_id } = decoded;
				if (iss != 'Jojonomic') {
					return404(req, res, next);
				}
				if (aud != 'jojonomic.com') {
					return404(req, res, next);
				}
				if (sub != 'jojoarief') {
					return404(req, res, next);
				}
				req.user_id = user_id;
				req.company_id = company_id;
				next();
			} else {
				return404(req, res, next);
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: error.message,
			});
		}	
	} else {
		return404(req, res, next);
	}
}

function return404(req, res, next) {
	res.status(401).json({
		message: 'not authorized',
	});
}

export default authorization;
