import * as helpers from '/helpers/general.js'

/** @param {NS} ns */
export async function main(ns) {
	for (const server of helpers.get_all_servers(ns)) {
		ns.killall(server);
	}
	ns.toast("Killed all scripts", "success");
}
