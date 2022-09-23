/** @param {NS} ns */
export async function main(ns) {
	var available_targets = [];
	for (const server of get_all_servers(ns)) {
		if (ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) < ns.getPlayer().skills.hacking && can_hack(ns, server)) {
			available_targets.push([server, ns.getServerMaxMoney(server)]);
		}
	}
	// var x = ns.getServer(target);
	// var threads = Math.round(0.9 / ns.formulas.hacking.hackPercent(x, ns.getPlayer()));
	// ns.tprint(threads);
	available_targets.sort(function(first, second) {
		return second[1] - first[1];
	});
	for (var server of available_targets.slice(0, 10)) {
		ns.tprint(server[0] + " - " + server[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		ns.print(server[0] + " - " + server[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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

function can_hack(ns, server) {
	var hacktoolnum = 0;
	var needed = ns.getServerNumPortsRequired(server);
	if (!ns.hasRootAccess(server)) {
		// ns.toast('Opening ports on ' + server_name, "info");
		ns.print('Opening ports on ' + server);
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			hacktoolnum++;
		}
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			hacktoolnum++;
		}
		if (ns.fileExists('relaySMTP.exe', 'home')) {
			hacktoolnum++;
		}
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			hacktoolnum++;
		}
		if (ns.fileExists('SQLInject.exe', 'home')) {
			hacktoolnum++;
		}
		return hacktoolnum >= needed ? true : false;
	}
	else {
		return true;
	}
}