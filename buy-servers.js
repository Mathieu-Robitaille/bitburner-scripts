/** @param {NS} ns */
export async function main(ns) {
	for (var i = 1; i < 26; i++) {
		// 	// ns.tprint("THICC-" + i.toString().padStart(3, '0'));
		// 	ns.tprint(i + " -- " + ns.getPurchasedServerCost(Math.pow(2, i)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + Math.pow(2, i) + "GB");
		// }
		var id = i;
		var size_to_buy = 1048576;
		// var size_to_buy = 65536;
		var server_name = "THICC-" + id.toString().padStart(3, '0');
		if (ns.serverExists(server_name)) { continue; }
		while (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(size_to_buy)) { await ns.sleep(10000); }
		ns.toast("Buying " + server_name, "success");
		ns.purchaseServer(server_name, size_to_buy);
		await helpers.copy_scripts_to_all_servers(ns, ["/orch/weaken.js", "/orch/grow.js", "/orch/hack.js", "/helpers/webreq.js"]);
	}
}