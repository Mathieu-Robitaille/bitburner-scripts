/** @param {NS} ns */
export async function main(ns) {
	// const HOSTNAME = ns.getHostname();
	const TARGET = ns.args[0];
	// const TARGET_SEC_LEVEL = 10;
	const TARGET_SEC_LEVEL = ns.getServerMinSecurityLevel(TARGET);
	// const TARGET_MAX_MONEY = 600_000_000 * 0.9;
	const TARGET_MAX_MONEY = ns.getServerMaxMoney(TARGET) * 0.5;
	ns.toast("FUCK THOSE GUYS AT " + TARGET, "success");
	while(true) {
		if(ns.getServerSecurityLevel(TARGET) > TARGET_SEC_LEVEL) {
			// ns.toast("Weakening " + TARGET, "warning");
			await ns.weaken(TARGET);
		}
		// if(ns.getServerMoneyAvailable(TARGET) <= TARGET_MAX_MONEY) {
		// 	// ns.toast("Growing " + TARGET, "info");
		// 	await ns.grow(TARGET);
		// } 
		// else {
		// 	// ns.toast("Hacking " + TARGET, "success");
		// 	await ns.hack(TARGET);
		// }
		if (ns.getServerSecurityLevel(TARGET) == TARGET_SEC_LEVEL) { 
			ns.print("done")
			break; 
		}
	}
}