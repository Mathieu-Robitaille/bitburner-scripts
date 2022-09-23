import * as web_helpers from '/helpers/webreq.js'

/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var threads = ns.args[1];
	await ns.grow(target);
	await web_helpers.post_grow_job(target, threads);
}