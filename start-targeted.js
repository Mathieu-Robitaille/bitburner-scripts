/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("exec");
	ns.disableLog("scp");


	const SERVER_FARM = ["THICC-001", "THICC-002", "THICC-003", "THICC-004","THICC-005",
						 "THICC-006", "THICC-007", "THICC-008", "THICC-009", "THICC-010",
						 "THICC-011", "THICC-012", "THICC-013", "THICC-014", "THICC-015",
						 "THICC-016", "THICC-017", "THICC-018", "THICC-019", "THICC-020",
						 "THICC-021", "THICC-022", "THICC-023", "THICC-024", "THICC-025"];
	const SCRIPT = "mine-targeted-farm.js";

	var targets = find_best(ns);

	for (const server of SERVER_FARM) {
		if (!ns.serverExists(server)) { continue; }
		//get ram for hack script
		var hackscriptram = ns.getScriptRam(SCRIPT, 'home');

		//get available server ram for this server
		var avsram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

		//calculate usethreads for hack script for this server
		var hsthreads = Math.floor(avsram / hackscriptram);

		//get the target for this server
		var target = targets.pop()[0];

		ns.print(`${server} targeting ${target}`)
		await ns.scp(SCRIPT, server);
		ns.exec(SCRIPT, server, hsthreads, target);
	}
}

function find_best(ns) {
	var available_targets = [];
	for (const server of get_all_servers(ns)) {
		if (ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() && can_hack(ns, server)) {
			available_targets.push([server, ns.getServerMaxMoney(server)]);
		}
	}
	// var x = ns.getServer(target);
	// var threads = Math.round(0.9 / ns.formulas.hacking.hackPercent(x, ns.getPlayer()));
	// ns.tprint(threads);
	available_targets.sort(function(first, second) {
		return second[1] - first[1];
	}).reverse();
	return available_targets.slice(0, 25);
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
			ns.brutessh(server);
			hacktoolnum++;
		}
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			ns.ftpcrack(server);
			hacktoolnum++;
		}
		if (ns.fileExists('relaySMTP.exe', 'home')) {
			ns.relaysmtp(server);
			hacktoolnum++;
		}
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			ns.httpworm(server);
			hacktoolnum++;
		}
		if (ns.fileExists('SQLInject.exe', 'home')) {
			ns.sqlinject(server);
			hacktoolnum++;
		}
		if (ns.getServerNumPortsRequired(server) <= hacktoolnum) {
            ns.nuke(server);
			return true;
		}
		else { return false; }
	}
	else {
		return true;
	}
}