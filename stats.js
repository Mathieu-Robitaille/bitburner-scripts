/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	ns.tail();
	const SEC_TO_WAIT = 5;

	while (true) {
		var p1     = ns.getPlayer();
		var exp1   = p1.exp.hacking;
		var hash1  = ns.hacknet.numHashes();
		var money1 = ns.getServerMoneyAvailable('home');
		await ns.sleep(SEC_TO_WAIT * 1000);

		var p2 = ns.getPlayer();
		var exp2 = p2.exp.hacking;
		var hash2  = ns.hacknet.numHashes();
		var money2 = ns.getServerMoneyAvailable('home');

		ns.clearLog();
		ns.print(`Diff over ${SEC_TO_WAIT} seconds.`);
		ns.print(`_$Diff_____ = ${ns.nFormat(money2 - money1, "$0.000a")}`);
		ns.print(`_EXP_______ = ${ns.nFormat(exp2 - exp1, "0.00a")}`);
		ns.print(`_HASHES____ = ${ns.nFormat(hash2 - hash1, "0.00a")}`);
		ns.print(`_Curr_Hash_ = ${ns.nFormat(hash2, "0.00a")}`);
		ns.print(`_HASH_CAP__ = ${ns.nFormat(ns.hacknet.hashCapacity(), "0.00a")}`);

		// ns.print(` __EXP_ = ${exp2 - exp1}`);
	}
}