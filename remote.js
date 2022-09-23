/** @param {NS} ns */
/** @param {String} server */
export async function main(ns) {
	ns.exec("worm.js", ns.args[0], 1, 1);
}