'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OrbitContext = {
		HelioCentricOrbit: 'http://www.semanticweb.org/rrovetto/ontologies/2014/ssao#Helio-Centric_Orbit',
		CelestialEntity: 'http://www.w3.org/2002/07/owl#NamedIndividual',
		double: 'http://www.w3.org/2001/XMLSchema#double',
		decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
		graph: '@graph',
		type: '@type',
		value: '@value',
		id: '@id',
		name: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_name',
			type: 'http://www.w3.org/2001/XMLSchema#Name'
		},
		apogee: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_Apogee',
			type: 'double'
		},
		perigee: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_Perigee',
			type: 'double'
		},
		raan: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_RAAN',
			type: 'double'
		},
		semiMajorAxis: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_Semi-major_Axis',
			type: 'double'
		},
		eccentricity: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_orbital_eccentricity',
			type: 'decimal'
		},
		inclination: {
			id: 'http://www.semanticweb.org/rrovetto/ontologies/2014/space-situational-awareness-ontology#has_orbital_inclination',
			type: 'decimal'
		}
	};

/**
 * Orbit Schema
 */
var OrbitSchema = new Schema({
	'@context': {
		type: Object,
		default: OrbitContext
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Orbit name',
		trim: true
	},
	apogee: Number,
	perigee: Number,
	raan: Number,
	semiMajorAxis: Number,
	eccentricity: Number,
	inclination: Number,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Orbit', OrbitSchema);
