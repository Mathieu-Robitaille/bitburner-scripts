/* list all servers you can buy */
/** @param {NS} ns */
export async function main(ns) {
	for (var i = 1; i < 21; i++) {
		ns.tprint(`${i} -- ${ns.nFormat(ns.getPurchasedServerCost(Math.pow(2, i)), "$0.00a")} ${Math.pow(2, i)}GB`);
	}
}