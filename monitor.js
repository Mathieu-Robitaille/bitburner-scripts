import * as formulasFacade from '/orch/formulasFacade.js'
import * as helpers from '/helpers/general.js'

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	while (true) {
		ns.clearLog();

		ns.print('Avail $  |  Max  $  | C Sec | M Sec | Times -> W | G | H');
		for (const serv of helpers.get_servers(ns).reverse()) {
			// var serv = ["the-hub"];
			var target_obj = ns.getServer(serv[0]);
			var player = ns.getPlayer();

			var grow_time = ns.nFormat(formulasFacade.growTime(target_obj, player) / 60000, "0.00");
			var weaken_time = ns.nFormat(formulasFacade.weakenTime(target_obj, player) / 60000, "0.00");
			var hack_time = ns.nFormat(formulasFacade.hackTime(target_obj, player) / 60000, "0.00");

			var avail_money = ns.nFormat(ns.getServerMoneyAvailable(serv[0]), "$000.00a");
			var max_money = ns.nFormat(ns.getServerMaxMoney(serv[0]), "$000.00a");

			var sec_level = ns.nFormat(ns.getServerSecurityLevel(serv[0]), "00.00a");
			var min_sec = ns.nFormat(ns.getServerMinSecurityLevel(serv[0]), "00.00");


			ns.print(`_____${serv[0]}_____`);
			ns.print(`${avail_money} | ${max_money} | ${sec_level} | ${min_sec} | ${weaken_time}m | ${grow_time}m | ${hack_time}m`);
	}
		var max = helpers.get_all_ram_in_farm(ns);
		var used = helpers.get_used_ram_in_farm(ns);
		var avail_percent = (max - used) / max * 100;
		ns.print(`\n${ns.nFormat(avail_percent, "00.00")}% of ram is available on the farm`);
		ns.print(`Number of scripts in orchestration:`);
		ns.print(`  Weaken: ${await helpers.get_number_of_instances_of_script(ns, '/orch/weaken.js')}`);
		ns.print(`  Grow  : ${await helpers.get_number_of_instances_of_script(ns, '/orch/grow.js')}`);
		ns.print(`  Hack  : ${await helpers.get_number_of_instances_of_script(ns, '/orch/hack.js')}`);

		await ns.sleep(1000);
	}
}