const RAM_FOR_THIS_SCRIPT = 4;
const RAM_FOR_MINE = 2.35;
const THIS_SCRIPT = "worm.js"
const SCRIPT = "mine-targeted.js";
const MY_SERVERS = ["home", 
					"THICC-001", "THICC-002", "THICC-003", "THICC-004","THICC-005",
					"THICC-006", "THICC-007", "THICC-008", "THICC-009", "THICC-010",
					"THICC-011", "THICC-012", "THICC-013", "THICC-014", "THICC-015",
					"THICC-016", "THICC-017", "THICC-018", "THICC-019", "THICC-020",
					"THICC-021", "THICC-022", "THICC-023", "THICC-024", "THICC-025",
					"hacknet-node-0", "hacknet-node-1", "hacknet-node-2", "hacknet-node-3", 
					"hacknet-node-4", "hacknet-node-5", "hacknet-node-6", "hacknet-node-7",
					"hacknet-node-8", "hacknet-node-9", "hacknet-node-10", "hacknet-node-11",
					"hacknet-node-12", "hacknet-node-13", "hacknet-node-14", "hacknet-node-15",
					"hacknet-node-16", "hacknet-node-17", "hacknet-node-18", "hacknet-node-19",
					"hacknet-node-20"];
/** @param {NS} ns */
export async function main(ns) {
	const HOSTNAME = ns.getHostname();
	ns.print("Worm on: " + HOSTNAME);
	ns.toast("Hello from: " + HOSTNAME, "info");

    //get all servers you can connect to
    var list_of_servers = ns.scan(HOSTNAME);

    //get ram for this script
    var scriptram = ns.getScriptRam(THIS_SCRIPT, 'home');

    //get ram for hack script
    var hackscriptram = ns.getScriptRam(SCRIPT, 'home');

    //get available server ram for this server
    var avsram = ns.getServerMaxRam(HOSTNAME) - ns.getServerUsedRam(HOSTNAME) + scriptram;

    //calculate usethreads for hack script for this server
    var hsthreads = Math.floor(avsram / hackscriptram);

	for (const server of list_of_servers) {
		if (MY_SERVERS.includes(server)) { continue; }

		ns.print("Worm on: " + HOSTNAME + " evaluating " + server);

		if (ns.hasRootAccess(server) || get_root(ns, server)) {
			await ns.scp(SCRIPT, server);
			await ns.scp(THIS_SCRIPT, server);

			ns.print("Worm on: " + HOSTNAME + " Copied files to " + server + ". Starting worm.");
			ns.exec(THIS_SCRIPT, server);
			await ns.sleep(3000);
			ns.print("Worm on: " + HOSTNAME + " sleeping for 3 seconds");
		}
	}

	ns.toast("launching miner on: " + HOSTNAME, "info")
	if (HOSTNAME != 'home') {
		ns.spawn(SCRIPT, hsthreads);
	}
	else {
		ns.spawn(SCRIPT, hsthreads - 5);
	}
	// ns.toast("Worm completed on: " + HOSTNAME, "success");
	await ns.sleep(11000);
}

function get_root(ns, server_name) {
	var hacktoolnum = 0;
	if (!ns.hasRootAccess(server_name)) {
		// ns.toast('Opening ports on ' + server_name, "info");
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
            ns.toast("nuking " + server_name, "info");
			ns.print("nuking " + server_name);
            ns.nuke(server_name);
			return true;
        } else {
			ns.toast("unable to gain root to " + server_name, "error");
			ns.print("unable to gain root to " + server_name);
			return false;
		}
	}
}