/** @param {NS} ns */
export async function main(ns) {
	const TARGET = "the-hub";
	const TARGET_OBJ = ns.getServer(TARGET);
    const PLAYER = ns.getPlayer();

	var cores = ns.getServer().cpuCores;
	var hack_percent = hackPercent(TARGET_OBJ, PLAYER) * 100;
	var grow_percent = growPercent(TARGET_OBJ, 1, PLAYER, 1);
    ns.tprint(grow_percent);

	var hack_threads = Math.round(50 / hack_percent);
	var grow_threads = Math.round(2.3 / (grow_percent - 1));
	var weaken_threads =  (ns.getServerSecurityLevel(TARGET) - ns.getServerMinSecurityLevel(TARGET) + (grow_threads * 0.004)) / 0.05;

    ns.tprint(`it would take ${hack_threads} threads to hack ${TARGET}`);
    ns.tprint(`it would take ${grow_threads} threads to grow ${TARGET}`);
    ns.tprint(`it would take ${weaken_threads} threads to weaken ${TARGET}`);

    var ht = hackTime(TARGET_OBJ, PLAYER);
    var gt = growTime(TARGET_OBJ, PLAYER);
    var wt = weakenTime(TARGET_OBJ, PLAYER);

    ns.tprint(`hack time --- ${ht}`);
    ns.tprint(`grow time --- ${gt}`);
    ns.tprint(`weaken time - ${wt}`);
}


export function hackPercent(server, player){
 
    const balanceFactor = 240;
    const difficultyMult = (100 - server.hackDifficulty) / 100;
    const skillMult = (player.skills.hacking - (server.requiredHackingSkill - 1)) / player.skills.hacking;
    const percentMoneyHacked = (difficultyMult * skillMult * player.mults.hacking_money) / balanceFactor;
    if (percentMoneyHacked < 0) {
      return 0;
    }
    if (percentMoneyHacked > 1) {
      return 1;
    }
    return percentMoneyHacked * 1 //BitNodeMultipliers.ScriptHackMoney;
}
 
export function growPercent(server, threads, player, cores = 1) {
 
    const numServerGrowthCycles = Math.max(Math.floor(threads), 0);
    const growthRate = 1.03 //CONSTANTS.ServerBaseGrowthRate;
    let adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > 1.0035 /*CONSTANTS.ServerMaxGrowthRate*/ ) {
        adjGrowthRate = 1.0035 /*CONSTANTS.ServerMaxGrowthRate*/ ;
    }
	
    const serverGrowthPercentage = server.serverGrowth / 100;
    const numServerGrowthCyclesAdjusted =
        numServerGrowthCycles * serverGrowthPercentage * 1 //BitNodeMultipliers.ServerGrowthRate;
    const coreBonus = 1 + (cores - 1) / 16;
    return Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * player.mults.hacking_grow * coreBonus);
}
 
export function weakenTime(server, player) {
 
    const weakenTimeMultiplier = 4;
    return weakenTimeMultiplier * utilCalculateHackingTime(server, player) * 1000;
}
 
export function growTime(server, player) {
 
    const growTimeMultiplier = 3.2;
    return growTimeMultiplier * utilCalculateHackingTime(server, player) * 1000;
}
 
export function hackTime(server, player) {
 
    return utilCalculateHackingTime(server, player) * 1000;
}
 
function utilCalculateIntelligenceBonus(intelligence, weight = 1) {
    return 1 + (weight * Math.pow(intelligence, 0.8)) / 600;
}
 
function utilCalculateHackingTime(server, player) {
   
    const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;
    const baseDiff = 500;
    const baseSkill = 50;
    const diffFactor = 2.5;
    let skillFactor = diffFactor * difficultyMult + baseDiff;
    skillFactor /= player.skills.hacking + baseSkill;
    const hackTimeMultiplier = 5;
    const hackingTime =
        (hackTimeMultiplier * skillFactor) /
        (player.mults.hacking_speed * utilCalculateIntelligenceBonus(player.skills.intelligence, 1));
    return hackingTime;
}