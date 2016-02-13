var create = require('../')
var exampleKeys = require('sdmp-example-keys')
var test = require('tape')
var NodeRSA = require('node-rsa')

test('generating an identity container with private key', function(t) {
	var privateKey = new NodeRSA(exampleKeys.privateKey)
	var container = create(privateKey, 'user')

	// basically just making sure it works here
	t.equals(container.sdmp.schemas.length, 1, 'there should only be the one schema')
	t.equals(container.sdmp.schemas[0], 'identity', 'the schema should be correct')
	t.equals(container.identity.type, 'user', 'should be the correct type')
	t.ok(container.identity.expires, 'the expiration exists')
	t.ok(container.identity.key, 'the key exists')

	// make sure the key is valid
	t.equals(typeof container.identity.key, 'string', 'key string should exist')
	var key = new NodeRSA(container.identity.key)
	t.ok(key.isPublic(true), 'should be a public key')

	t.end()
})

test('generating an identity container with public key', function(t) {
	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var container = create(publicKey, 'user')

	// basically just making sure it works here
	t.equals(container.sdmp.schemas.length, 1, 'there should only be the one schema')
	t.equals(container.sdmp.schemas[0], 'identity', 'the schema should be correct')
	t.equals(container.identity.type, 'user', 'should be the correct type')
	t.ok(container.identity.expires, 'the expiration exists')
	t.ok(container.identity.key, 'the key exists')

	// make sure the key is valid
	t.equals(typeof container.identity.key, 'string', 'key string should exist')
	var key = new NodeRSA(container.identity.key)
	t.ok(key.isPublic(true), 'should be a public key')

	t.end()
})

test('generating an identity container with specific expiration', function(t) {
	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var container = create(publicKey, 'user', 1486095035064)

	t.equals(container.identity.expires, '2017-02-03T04:10:35.064Z', 'expiration date should be this')
	t.end()
})

test('generating an identity container without key', function(t) {
	var matcher = /property `key` is required/
	t.throws(function() { create() }, matcher, 'should throw this')
	t.end()
})

test('generating an identity container with invalid type', function(t) {
	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var matcher = /property `identityType` must be `user` or `node`/
	t.throws(function() { create(publicKey, 'bad_type') }, matcher, 'should throw this')
	t.end()
})
