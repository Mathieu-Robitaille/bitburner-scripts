import * as formulasFacade from '/orch/formulasFacade.js'
import * as helpers from '/helpers/general.js'


const WEAKEN_SCRIPT = "/orch/weaken.js";
const GROW_SCRIPT = "/orch/grow.js"; 
const HACK_SCRIPT = "/orch/hack.js"; 


/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	const DELAY = 1000;
	const PLAYER = ns.getPlayer();
	const TARGET = ns.args[0];
	const TARGET_OBJ = ns.getServer(TARGET);

	const WEAKEN_RAM = ns.getScriptRam(WEAKEN_SCRIPT);
	const HACK_RAM = ns.getScriptRam(HACK_SCRIPT);
	const GROW_RAM = ns.getScriptRam(GROW_SCRIPT);
	// const TOTAL_RAM = WEAKEN_RAM * 2 + HACK_RAM + GROW_RAM;

	// ns.disableLog("ALL");

	var hack_percent = formulasFacade.hackPercent(TARGET_OBJ, PLAYER) * 100;
	var grow_percent = formulasFacade.growPercent(TARGET_OBJ, 1, PLAYER, 1);

	var hack_threads = Math.round(50 / hack_percent);
	var grow_threads = Math.round(2.3 / (grow_percent - 1));

	var weaken_threads =  (ns.getServerSecurityLevel(TARGET) - ns.getServerMinSecurityLevel(TARGET) + (grow_threads * 0.004)) / 0.05;

	var weaken_time_start = 0;
	var weaken2_time_start = 2 * DELAY;
	var grow_start_time = weaken2_time_start + formulasFacade.weakenTime(TARGET_OBJ, PLAYER) - formulasFacade.growTime(TARGET_OBJ, PLAYER) - DELAY;

	// Hack start time is offset from grow_start_time
	var hack_start_time = formulasFacade.weakenTime(TARGET_OBJ, PLAYER) + DELAY * 3 - formulasFacade.hackTime(TARGET_OBJ, PLAYER) - grow_start_time;

	ns.print("Launching cycle")
	// Commented cause we really dont need it
	// await ns.sleep(weaken_time_start);
	
	var total_cost = WEAKEN_RAM * 2 * weaken_threads + GROW_RAM * grow_threads + HACK_RAM * hack_threads;
	ns.print(`Need ${total_cost} ram to target ${TARGET}\n   ${ns.nFormat(weaken_threads, "0.0")} weaken threads\n   ${ns.nFormat(grow_threads, "0.0")} grow threads\n   ${ns.nFormat(hack_threads, "0.0")} hack threads`);
	ns.print(`   ${ns.nFormat(weaken_threads * WEAKEN_RAM, "0.0")} weaken ram\n   ${ns.nFormat(grow_threads * GROW_RAM, "0.0")} grow ram\n   ${ns.nFormat(hack_threads * HACK_RAM, "0.0")} hack ram`);



	var weaken1_pid = await issue_job(ns, WEAKEN_SCRIPT, weaken_threads, TARGET, WEAKEN_RAM, "weaken");
	// await helpers.issue_number_of_jobs(ns, TARGET, WEAKEN_SCRIPT, weaken_threads);
	
	await ns.sleep(weaken2_time_start);	
	var weaken2_pid = await issue_job(ns, WEAKEN_SCRIPT, weaken_threads, TARGET, WEAKEN_RAM, "weaken");
	// await helpers.issue_number_of_jobs(ns, TARGET, WEAKEN_SCRIPT, weaken_threads);

	await ns.sleep(grow_start_time);
	var grow_pid = await issue_job(ns, GROW_SCRIPT, grow_threads, TARGET, GROW_RAM, "grow");
	// await helpers.issue_number_of_jobs(ns, TARGET, GROW_SCRIPT, grow_threads);
	
	await ns.sleep(hack_start_time);
	if (grow_pid != 0) {
		var hack_pid = await issue_job(ns, HACK_SCRIPT, hack_threads, TARGET, HACK_RAM, "hack");
	}
	// await helpers.issue_number_of_jobs(ns, TARGET, HACK_SCRIPT, hack_threads);

		
}
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


/** @param {NS} ns */
async function issue_job(ns, script, threads, target, ram, type) {

	var MY_SERVERS = [];
	// const MY_SERVERS = ["home"];
	if (ns.serverExists("THICC-001")) {
		MY_SERVERS = ["THICC-001", "THICC-002", "THICC-003", "THICC-004","THICC-005",
							"THICC-006", "THICC-007", "THICC-008", "THICC-009", "THICC-010",
							"THICC-011", "THICC-012", "THICC-013", "THICC-014", "THICC-015",
							"THICC-016", "THICC-017", "THICC-018", "THICC-019", "THICC-020",
							"THICC-021", "THICC-022", "THICC-023", "THICC-024", "THICC-025"];
		// MY_SERVERS = ["hacknet-node-0", "hacknet-node-1", "hacknet-node-2", "hacknet-node-3", "hacknet-node-4", 
		// 			  "hacknet-node-5", "hacknet-node-6", "hacknet-node-7", "hacknet-node-8", "hacknet-node-9", 
		// 			  "hacknet-node-10", "hacknet-node-11", "hacknet-node-12", "hacknet-node-13", "hacknet-node-14",
		// 			  "hacknet-node-15", "hacknet-node-16", "hacknet-node-17", "hacknet-node-18", "hacknet-node-19"]
	}
	else {
		MY_SERVERS = ["home"];
	}

	for (const serv of MY_SERVERS) {
		if (!ns.serverExists(serv)) { continue; }
		if (ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv) >= ram * threads) {
			ns.print(`Starting ${type} job on ${target} from ${serv}.`)
			await ns.scp([HACK_SCRIPT, GROW_SCRIPT, WEAKEN_SCRIPT], serv);
			return ns.exec(script, serv, threads, target, uuidv4());
		}
	}
	ns.print(`Could not find server with enough ram, need ${ram * threads}`)
	return 0;
}