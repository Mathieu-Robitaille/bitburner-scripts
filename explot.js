/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	const a = 55;
	ns.print(a.toExponential())
	Number.prototype.toExponential = () => {}
	ns.print(a.toExponential())
	var p = ns.getPlayer();
	p.giveExploit();
}