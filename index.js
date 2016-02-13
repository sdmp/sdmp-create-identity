var moment = require('moment')
var JsSha = require('jssha')
var base64 = require('base64-url')

var millisInOneYear = 365 * 24 * 60 * 60 * 1000
var defaultExpirationMillis = millisInOneYear * 5

function getKeyFingerprint(keyString) {
	// the SDMP specs say that the key fingerprint
	// is the SHA-512 hash of the JSON encoded key:
	// http://sdmp.io/spec/0.12/core/cryptography/#key-fingerprint
	// to do this we use JSON.stringify but this gives
	// us a string surrounded with double quotes, which
	// we then remove:
	var escapedKeyString = JSON.stringify(keyString).replace(/^"/, '').replace(/"$/, '')

	var sha = new JsSha('SHA-512', 'TEXT')
	sha.update(escapedKeyString)
	var base64hash = sha.getHash('B64')
	return base64.escape(base64hash)
}

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

	var keyString = key.exportKey('pkcs8-public-pem')

	return {
		sdmp: {
			version: '0.13',
			schemas: [ 'identity' ]
		},
		identity: {
			type: identityType,
			expires: expiration.toISOString(),
			key: keyString,
			fingerprint: getKeyFingerprint(keyString)
		}
	}
}
