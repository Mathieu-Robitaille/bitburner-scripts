// import * as formulasFacade from '/orch/formulasFacade.js'

/** @param {NS} ns */
export async function main(ns) {
	// const HOSTNAME = ns.getHostname();
	const TARGET = "n00dles";
	// const TARGET_SEC_LEVEL = 10;
	const TARGET_SEC_LEVEL = ns.getServerMinSecurityLevel(TARGET) + 5;
	// const TARGET_MAX_MONEY = 600_000_000 * 0.9;
	const TARGET_MAX_MONEY = ns.getServerMaxMoney(TARGET) * 0.8;
	ns.toast("FUCK THOSE GUYS AT " + TARGET, "success");


	while(true) {
		while (ns.getServerSecurityLevel(TARGET) > TARGET_SEC_LEVEL) {
			await ns.weaken(TARGET);
		}
		if (ns.getServerMoneyAvailable(TARGET) < TARGET_MAX_MONEY){
			await ns.grow(TARGET);
		}
		else {
			await ns.hack(TARGET);
		}
	}
}