import * as helpers from '/helpers/general.js'


/** @param {NS} ns */
export async function main(ns) {
	var available_targets = [];
	for (const server of helpers.get_all_servers(ns)) {
		if (ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) < ns.getPlayer().skills.hacking && helpers.can_hack(ns, server)) {
			available_targets.push([server, ns.getServerMaxMoney(server)]);
		}
	}

	available_targets.sort(function(first, second) {
		return second[1] - first[1];
	});
	for (var server of available_targets.slice(0, 10)) {
		ns.tprint(server[0] + " - " + server[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		ns.print(server[0] + " - " + server[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	}
}
