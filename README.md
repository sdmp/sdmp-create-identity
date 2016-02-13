# sdmp-create-identity

This module will create an [`identity`](http://sdmp.io/spec/0.13/core/identity/)
container object according to the specifications in the
[SDMP](http://sdmp.io) protocol.

## install

This module is made to use [npm](https://www.npmjs.com/). Install
the normal `npm` way:

	npm install sdmp-create-identity

## use it

You must pass in a [node-rsa](https://github.com/rzcoder/node-rsa)
object containing a public or private key of `2048` bits (if a private
key is given, the public key is derived from it):

	var create = require('sdmp-create-identity')
	var container = create(nodeRsaKey, 'node')
	// container is a valid identity container object, e,g,
	console.log(container.identity.key) // => -----BEGIN PUBLIC KEY-----...

## node-rsa

The node-rsa module is an RSA crypto module implemented in pure
JavaScript. This gives maximum portability, but generating keys
in JS is not as fast as system-native libraries.

You can create a `node-rsa` public key object any of the following ways:

#### new key

	var NodeRSA = require('node-rsa')
	var nodeRsaKey = new NodeRSA({ b: 2048 })

#### from PEM encoded string

	var NodeRSA = require('node-rsa')
	var pemKey = '-----BEGIN PUBLIC KEY-----\n...'
	var nodeRsaKey = new NodeRSA(pemKey)

#### from existing SDMP `private_key` container

	var NodeRSA = require('node-rsa')
	var container = // a valid `private_key` container
	var nodeRsaKey = new NodeRSA(container.private_key.key)

## api `create(nodeRsaKey, identityTypeString[, unixOffsetToExpire])`

In all cases, calling the function will either return a new
container object, or throw an exception.

###### `nodeRsaKey` *(`object`, required)*

The parameter `nodeRsaKey` must be a [node-rsa](https://github.com/rzcoder/node-rsa)
equivalent object, containing a public or private key of `2048` bytes.

###### `identityTypeString` *(`string`, required)*

Any valid [SDMP identity type](http://sdmp.io/spec/0.12/core/identity/),
which is currently `user` or `node`.

###### `unixOffsetToExpire` *(`integer`, optional)*

Pass in the unix offset (milliseconds since Unix Epoch) and the
UTC expiration date will be set to that exact date.

If this value is not set, the expiration date will be set to
five years in the future.

## license

Published and released under the [Very Open License](http://veryopenlicense.com/).

`<3`
