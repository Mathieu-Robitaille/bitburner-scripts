import * as helpers from '/helpers/general.js'

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	await helpers.copy_scripts_to_all_servers(ns, ["/orch/weaken.js", "/orch/grow.js", "/orch/hack.js", "/helpers/webreq.js"]);
	while (true) {
		// for (const serv of helpers.get_servers(ns).slice(0, 10)) {
		for (const serv of helpers.get_servers(ns).slice(0, 20)) {
			const SCRIPT = "orchestrate.js";
			const RUN_SERVER = "home";
			const TARGET = serv[0];
			// const TARGET = "catalyst";
			ns.exec(SCRIPT, RUN_SERVER, 1, TARGET, helpers.uuidv4());
		}
		await ns.sleep(3 * 1000);
	}
}