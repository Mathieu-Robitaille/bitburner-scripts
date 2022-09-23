/** @param {NS} ns */
export async function main(ns) {
	var done = false;
	ns.disableLog("ALL");

	while (!done) {
		var upgrade_costs = {};
		for (var i = 0; i < ns.hacknet.numNodes(); i++) {
			
			var upgrade_opts = {
				'level': [ns.hacknet.getLevelUpgradeCost(i, 1), ns.hacknet.upgradeLevel],
				'ram':   [ns.hacknet.getRamUpgradeCost(i, 1), ns.hacknet.upgradeRam],
				'cores': [ns.hacknet.getCoreUpgradeCost(i, 1), ns.hacknet.upgradeCore],
				'cache': [ns.hacknet.getCacheUpgradeCost(i, 1), ns.hacknet.upgradeCache],
			}

			var keys   = Object.keys(upgrade_opts);
			var lowest = Math.min.apply(null, keys.map(function(x) { return upgrade_opts[x][0] }));
			var match  = keys.filter((x) => { return upgrade_opts[x][0] === lowest });

			upgrade_costs[i] = [match[0], lowest, upgrade_opts[match][1]];
		}

		if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()){
			upgrade_costs[ns.hacknet.numNodes + 1] = ['new node', ns.hacknet.getPurchaseNodeCost(), ns.hacknet.purchaseNode];
		}
		
		var keys   = Object.keys(upgrade_costs);
		var lowest = Math.min.apply(null, keys.map(function(x) { return upgrade_costs[x][1] }));
		var match  = keys.filter(function(x) { return upgrade_costs[x][1] === lowest })[0];

		await wait_for_money(ns, lowest, `I'm poor and need ${ns.nFormat(lowest - ns.getServerMoneyAvailable("home"), "$0.00a")}`);
	
		ns.print(`Buying hacknet-node-${match} a brand new ${upgrade_costs[match][0]}`)
		if (match === 'new node') {
			upgrade_costs[match][2]();
		}
		else {
			upgrade_costs[match][2](match, 1);
		}
	}
}

async function wait_for_money(ns, target, wait_text) {
	ns.print(wait_text);
	ns.print(`Need ${ns.nFormat(target, "$0.000a")}`);
	while (ns.getServerMoneyAvailable('home') < target) {
		await ns.sleep(1000);
	}
}