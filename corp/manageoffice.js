export async function main(ns) {
    while (true){
        await ns.sleep(1000);
        let office = ns.corporation.getOffice(ns.args[0], ns.args[1]);
        let energy = office.avgEnergy;
        let maxenergy = office.maxEnergy;
        let morale = office.avgMorale;
        let maxmorale = office.maxMorale;
        if (energy < maxenergy * 0.97){
            ns.corporation.buyTea(ns.args[0], ns.args[1]);
        }
        if (morale < maxmorale * 0.50){
            ns.corporation.throwParty(ns.args[0], ns.args[1], 10000000);
        } else if (morale >= maxmorale * 0.50 && morale < maxmorale * 0.80){
            ns.corporation.throwParty(ns.args[0], ns.args[1], 1000000);
        } else if (morale >= maxmorale * 0.80 && morale < maxmorale * 0.96){
            ns.corporation.throwParty(ns.args[0], ns.args[1], 100000);
        }
    }
}