/** @param {NS} ns */
export function get_servers(ns) {
	var available_targets = [];
	for (const server of get_all_servers(ns)) {
		if (ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() && can_hack(ns, server)) {
			available_targets.push([server, ns.getServerMaxMoney(server)]);
		}
	}
	available_targets.sort(function(first, second) {
		return second[1] - first[1];
	});
	return available_targets;
}

/** @param {NS} ns */
export function get_all_servers(ns) {
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
	return Array.from(ALL_SERVERS);
}

/** @param {NS} ns */
export function can_hack(ns, server) {
	var hacktoolnum = 0;
	var needed = ns.getServerNumPortsRequired(server);
	if (!ns.hasRootAccess(server)) {
		// ns.toast('Opening ports on ' + server_name, "info");
		// ns.print('Opening ports on ' + server);
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
		if (hacktoolnum >= needed) {
			ns.nuke(server);
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return true;
	}
}

/** @param {NS} ns */
export function get_all_ram_in_farm(ns) {
	var servers = ns.getPurchasedServers();
	// var servers = get_all_servers(ns);
	// servers = servers.filter((x) => {x !== 'home'});
	var total_avail = 0;
	servers.map((x) => { can_hack(ns, x) ? total_avail += ns.getServerMaxRam(x) : total_avail += 0 })
	return total_avail;
}

/** @param {NS} ns */
export function get_used_ram_in_farm(ns) {
	var servers = ns.getPurchasedServers();
	// var servers = get_all_servers(ns);
	// servers = servers.filter((x) => {x !== 'home'});
	var total_used = 0;
	servers.map((x) => { can_hack(ns, x) ? total_used += ns.getServerUsedRam(x) : total_used += 0 })
	return total_used;
}

/** @param {NS} ns */
export async function issue_number_of_jobs(ns, target, script, threads) {
	const servers = get_all_servers(ns);
	for (var i = 0; i < threads; i++) {
		var opts = servers.filter((x) => ns.serverExists(x));
		opts = servers.filter((x) => ns.getServerMaxRam(x) - ns.getServerUsedRam(x) >= ns.getScriptRam(script));
		var runner = opts[0];
		ns.exec(script, runner, 1, target, uuidv4());
	}
}

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/** @param {NS} ns */
export async function copy_scripts_to_all_servers(ns, scripts) {
	const servers = get_all_servers(ns);
	for (const server of servers) {
		if (ns.serverExists(server)) {
			await ns.scp(scripts, server);
		}
	}
}

/** @param {NS} ns */
export async function get_number_of_instances_of_script(ns, script) {
	var servers = get_all_servers(ns);
	// servers = servers.filter((x) => {x !== 'home'});
	var total = 0;
	for (const server of servers) {
		var p = ns.ps(server);
		for (const entry of p) {
			if (entry.filename === script) {
				total += 1;
			}
		}
	}
	return total;
}