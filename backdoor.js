/** @param {NS} ns */
export async function main(ns) {
	for (const server of get_all_servers(ns)) {
		if (get_root(ns, server)) {
			await ns.installBackdoor(server);
		}
	}
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

function get_root(ns, server_name) {
	var hacktoolnum = 0;
	if (!ns.hasRootAccess(server_name)) {
		ns.print('Opening ports on ' + server_name);
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			ns.brutessh(server_name);
			hacktoolnum++;
		}
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			ns.ftpcrack(server_name);
			hacktoolnum++;
		}
		if (ns.fileExists('relaySMTP.exe', 'home')) {
			ns.relaysmtp(server_name);
			hacktoolnum++;
		}
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			ns.httpworm(server_name);
			hacktoolnum++;
		}
		if (ns.fileExists('SQLInject.exe', 'home')) {
			ns.sqlinject(server_name);
			hacktoolnum++;
		}
		if (ns.getServerNumPortsRequired(server_name) <= hacktoolnum) {
			ns.print("nuking " + server_name);
            ns.nuke(server_name);
			return true;
        } else {
			ns.print("unable to gain root to " + server_name);
			return false;
		}
	}
}