/** @param {NS} ns */
export async function main(ns) {
	for (var i = 1; i < 26; i++) {
		var id = i;
		var size_to_buy = 1048576;
		// var size_to_buy = 65536; // used early game just to get a server going
		var server_name = "THICC-" + id.toString().padStart(3, '0');
		if (ns.serverExists(server_name)) { continue; }
		while (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(size_to_buy)) { await ns.sleep(10000); }
		ns.toast("Buying " + server_name, "success");
		ns.purchaseServer(server_name, size_to_buy);
	}
}