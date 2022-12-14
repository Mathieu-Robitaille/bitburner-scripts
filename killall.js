/** @param {NS} ns */
export async function main(ns) {
	for (const server of get_all_servers(ns)) {
		ns.killall(server);
	}
	ns.toast("Killed all scripts", "success");
}

function get_all_servers(ns) {
	const ALL_SERVERS = new Set();
	const TARGETS = ["home"];
	while (TARGETS.length > 0) {
		var target = TARGETS.pop();
		for (const server of ns.scan(target)) {
			if (!ALL_SERVERS.has(server)) {
				TARGETS.push(server);
			}
			ALL_SERVERS.add(server);
		}
	}
	return ALL_SERVERS;
}