/** @param {NS} ns */
export async function main(ns) {
	for (var i = 1; i < 21; i++) {
		ns.tprint(i + " -- " + ns.getPurchasedServerCost(Math.pow(2, i)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + Math.pow(2, i) + "GB");
	}
}