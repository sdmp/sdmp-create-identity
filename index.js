var moment = require('moment')

var millisInOneYear = 365 * 24 * 60 * 60 * 1000
var defaultExpirationMillis = millisInOneYear * 5

module.exports = function createIdentityContainer(key, identityType, unixOffsetToExpire) {
	if (!key || typeof key !== 'object') {
		throw 'property `key` is required'
	}

	if (key.getKeySize() !== 2048) {
		throw 'key size must be `2048`'
	}

	if (identityType !== 'user' && identityType !== 'node') {
		throw 'property `identityType` must be `user` or `node`'
	}

	var expiration
	if (unixOffsetToExpire) {
		expiration = moment(unixOffsetToExpire)
	} else {
		expiration = moment().add(defaultExpirationMillis, 'milliseconds')
	}

	return {
		sdmp: {
			version: '0.13',
			schemas: [ 'identity' ]
		},
		identity: {
			type: identityType,
			expires: expiration.toISOString(),
			key: key.exportKey('pkcs8-public-pem')
		}
	}
}
