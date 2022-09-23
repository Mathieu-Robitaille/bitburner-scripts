import * as formulasFacade from '/orch/formulasFacade.js'
import * as helpers from '/helpers/general.js'
import * as web_helpers from '/helpers/webreq.js'

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	while (true) {
		for (const serv of helpers.get_servers(ns).reverse()) {
			// var serv = ["the-hub"];
			var target_obj = ns.getServer(serv[0]);
			var player = ns.getPlayer();

			var grow_time = formulasFacade.growTime(target_obj, player)
			var weaken_time = formulasFacade.weakenTime(target_obj, player)
			var hack_time = formulasFacade.hackTime(target_obj, player)

			var avail_money = ns.getServerMoneyAvailable(serv[0])
			var max_money = ns.getServerMaxMoney(serv[0])

			var sec_level = ns.getServerSecurityLevel(serv[0])
			var min_sec = ns.getServerMinSecurityLevel(serv[0])


			// ns.print(`_____${serv[0]}_____`);
			// ns.print(`${avail_money} | ${max_money} | ${sec_level} | ${min_sec} | ${weaken_time}m | ${grow_time}m | ${hack_time}m`);

			var data = '{' +
				`"${serv[0]}.grow_time": "${grow_time}",` +
				`"${serv[0]}.weaken_time": "${weaken_time}",` +
				`"${serv[0]}.hack_time": "${hack_time}",` +
				`"${serv[0]}.avail_money": "${avail_money}",` +
				`"${serv[0]}.max_money": "${max_money}",` +
				`"${serv[0]}.sec_level": "${sec_level}",` +
				`"${serv[0]}.min_sec": "${min_sec}"` + '}';
			await web_helpers.post_server_analasys(ns, data);
				
	}
		var max = helpers.get_all_ram_in_farm(ns);
		var used = helpers.get_used_ram_in_farm(ns);
		var avail_percent = (max - used) / max * 100;

		var num_weaken_scripts = await helpers.get_number_of_instances_of_script(ns, '/orch/weaken.js');
		var num_grow_scripts = await helpers.get_number_of_instances_of_script(ns, '/orch/grow.js')
		var num_hack_scripts = await helpers.get_number_of_instances_of_script(ns, '/orch/hack.js')

		// ns.print(`\n${ns.nFormat(avail_percent, "00.00")}% of ram is available on the farm`);
		// ns.print(`Number of scripts in orchestration:`);
		// ns.print(`  Weaken: ${num_weaken_scripts}`);
		// ns.print(`  Grow  : ${num_grow_scripts}`);
		// ns.print(`  Hack  : ${num_hack_scripts}`);

		var data = '{' +
				`"monitor.farm.max_ram": "${max}",` +
				`"monitor.farm.used_ram": "${used}",` +
				`"monitor.farm.avail_percent": "${avail_percent}",` +
				`"monitor.orchestration.weaken_scripts": "${num_weaken_scripts}",` +
				`"monitor.orchestration.grow_scripts": "${num_grow_scripts}",` +
				`"monitor.orchestration.hack_scripts": "${num_hack_scripts}"` + '}';

		await web_helpers.post_orchestration_stats(data);

		await ns.sleep(1000);
	}
}