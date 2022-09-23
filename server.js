import * as helpers from '/helpers/general.js'

/** @param {NS} ns */
export async function main(ns) {
	ns.tail()
	helpers.get_all_servers(ns).map((x) => ns.tprint(x));
}