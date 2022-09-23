/** @param {NS} ns */
export async function main(ns) {
	// const HOSTNAME = ns.getHostname();
	const TARGET = "omega-net";
	ns.toast("FUCK THOSE GUYS AT " + TARGET, "success");
	while(true) {
		if(ns.getServerSecurityLevel(TARGET) > ns.getServerMinSecurityLevel(TARGET) + 5) {
			ns.toast("Weakening " + TARGET, "warning");
			await ns.weaken(TARGET);
		}
		if(ns.getServerMoneyAvailable(TARGET) <= ns.getServerMaxMoney(TARGET) * 0.25) {
			ns.toast("Growing " + TARGET, "info");
			await ns.grow(TARGET);
		} else {
			ns.toast("Hacking " + TARGET, "success");
			await ns.hack(TARGET);
		}
	}
}