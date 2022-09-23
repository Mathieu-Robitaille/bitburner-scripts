import * as web_helpers from '/helpers/webreq.js'

/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var threads = ns.args[1];
	var amount = await ns.hack(target);
	await web_helpers.post_hack_job(target, amount, threads);
}