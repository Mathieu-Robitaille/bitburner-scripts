/** @param {NS} ns */
export async function main(ns) {
	const target = 'Sell for Money';
	// const target = 'Improve Studying';
	while(true) {
		if (ns.hacknet.numHashes() >= ns.hacknet.hashCost(target)) {
			ns.hacknet.spendHashes(target);
		}
		else {
			await ns.sleep(1 * 100);
		}
		
	}
}