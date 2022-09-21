/** @param {NS} ns */
export async function main(ns) {
	var level =              2;
	var ram   =  Math.pow(2,  2); // Target in GB
	var cores =               2;
	var cache =               1;

	ns.disableLog("ALL");

	while (level < 200 && ram < 20 && cores < 16) {
		for (var i = 0; i < ns.hacknet.numNodes(); i++) {
			let node = ns.hacknet.getNodeStats(i);

			//
			var diff = level - node.level;
			if(diff > 0) { 
				await wait_for_money(ns, ns.hacknet.getLevelUpgradeCost(i, diff), `Upgrading hacknet-node-${i} level to ${level}`);
				ns.hacknet.upgradeLevel(i, diff);
			}

			//
			var diff = Math.log2(ram) - Math.log2(node.ram);
			if(diff > 0) { 
				await wait_for_money(ns, ns.hacknet.getRamUpgradeCost(i, diff), `Upgrading hacknet-node-${i} ram to ${ram}GB`);
				ns.hacknet.upgradeRam(i, diff);
			}

			//
			var diff = cores - node.cores;
			if(diff > 0) { 
				await wait_for_money(ns, ns.hacknet.getCoreUpgradeCost(i, diff), `Upgrading hacknet-node-${i} cores to ${cores}`);
				ns.hacknet.upgradeCore(i, diff);
			}

			//
			var diff = cache - node.cache;
			if(diff > 0) { 
				await wait_for_money(ns, ns.hacknet.getCacheUpgradeCost(i, diff), `Upgrading hacknet-node-${i} cache to ${cache}`);
				ns.hacknet.upgradeCache(i, diff);
			}
		}
		if (level < 200) {
			level += 5;
		}
		if (ram < 20) {
			ram += 1;
		}
		if (cores < 16) {
			cores += 1;
		}
	}
}

async function wait_for_money(ns, target, wait_text) {
	while (ns.getServerMoneyAvailable('home') < target) {
		ns.clearLog();
		ns.print(wait_text);
		var diff = target - ns.getServerMoneyAvailable('home');
		ns.print(`Need ${ns.nFormat(diff, "$0.000a")} more`);
		await ns.sleep(1000);
	}
}