export async function main(ns){
    let usehive = false;
    let usegang = false;
    let usecorp = false;
    let usehacknet = false;
    let usebladeburner = false;
    let hackToCrash = true;
    let curCash = ns.getServerMoneyAvailable("home");
    let prevMaxRam = 0;
    let maxRam = 0;

    if (ns.args.includes("hive")){usehive = true;}
    if (ns.args.includes("gang")){usegang = true;}
    if (ns.args.includes("corp")){usecorp = true;}
    if (ns.args.includes("hacknet")){usehacknet = true;}
    if (ns.args.includes("bladeburner")){
        usebladeburner = true;
        hackToCrash = false;
    }

    if (usehive){
        maxRam = await spinUpHive(ns, true);
    }
    await ns.sleep(500);
    while (true){
        if (usehive){
            if ((maxRam == 2048 || maxRam == 32768 || maxRam == 262144) && maxRam != prevMaxRam){
                maxRam = await spinUpHive(ns, true);
            } else {
                maxRam = await spinUpHive(ns, false);
            }
            prevMaxRam = maxRam;
        }

        if (hackToCrash){
            await nodeKiller_hack(ns);
        }

        if (usegang){
            await spinUpGang(ns);
        }

        if (usebladeburner){

        }
        await ns.sleep(30000);
    } 
}

async function nodeKiller_hack(ns){
    let joinedFactions = ns.getPlayer().factions;
    let availableFactions = ns.singularity.checkFactionInvitations();
    let numSleeves = ns.sleeve.getNumSleeves();
    let inDaedelus = false;
    let hasRedPill = false;
    if (joinedFactions.includes("Daedalus")){
        inDaedelus = true;
    }
    let ownedAugs = ns.singularity.getOwnedAugmentations();
    if (ownedAugs.includes("The Red Pill")){
        hasRedPill = true;
    }
    if (availableFactions.includes("Daedalus") && !inDaedelus){
        ns.singularity.joinFaction("Daedalus");
        inDaedelus = true;
    }
    if (inDaedelus && !hasRedPill) {
        let redpillrep = ns.singularity.getAugmentationRepReq("The Red Pill");
        let curDaedalusRep = ns.singularity.getFactionRep("Daedalus");
        if (curDaedalusRep >= redpillrep){
            ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill");
            ns.singularity.installAugmentations("/singularity/precrash.js");
        } else {
            ns.singularity.workForFaction("Daedalus", "hacking");
            ns.singularity.setToFactionWork(0, "Daedalus", "field");
        }
    }
    if (hasRedPill){
        let canCrash = false;
        let crashDifficulty = ns.getServerRequiredHackingLevel("w0r1d_d43m0n");
        if (crashDifficulty <= ns.getHackingLevel()){
            canCrash = true;
        }
        if (canCrash){
            ns.exec("/basic/killall.js", "home");
            ns.killall("home", true);
            ns.exec("/hive/swarm.js", "home", 1, 65536, 256, 100, 100);
            await ns.sleep(500);
            //make smarter once everything works flawlessly on BN-12
            ns.singularity.destroyW0r1dD43m0n(12, "/singularity/newnode.js");
        } else {
            for (let i = 0; i < numSleeves; ++i){
                ns.sleeve.travel(i, "Volhaven");
                ns.sleeve.setToUniversityCourse(i, "ZB Institute of Technology", "Algorithms");
            }
            ns.singularity.travelToCity("Volhaven");
            ns.singularity.universityCourse("ZB Institute of Technology", "Algorithms");
        }
    }
}

async function spinUpHive(ns, doReset){
    let curCash = ns.getServerMoneyAvailable("home");
    let hasTor = false;
    if (ns.hasTorRouter()){
        hasTor = true;
    }
    if (curCash > 200000 && !hasTor){
        ns.singularity.purchaseTor();
        hasTor = true;
    }
    if (hasTor){
        let dwPrograms = ns.singularity.getDarkwebPrograms();
        for (let i = 0; i < dwPrograms.length; ++i){
            let programCost = ns.singularity.getDarkwebProgramCost(dwPrograms[i]);
            if (hasTor && curCash > programCost && programCost > 0){
                ns.singularity.purchaseProgram(dwPrograms[i]);
            }
        }
    }
    if (curCash > ns.singularity.getUpgradeHomeRamCost() && ns.getServerMaxRam("home") < 1048576){
        ns.singularity.upgradeHomeRam();
    }
    if (curCash > ns.singularity.getUpgradeHomeCoresCost()){
        ns.singularity.upgradeHomeCores();
    }
    if (doReset){
        if (ns.getServerMaxRam("home") < 2048){
            ns.exec("/hive/swarm.js", "home", 1, 4096, 1, 2, 5000);
        } else if (ns.getServerMaxRam("home") >= 2048 && ns.getServerMaxRam("home") < 32768){
            ns.exec("/hive/swarm.js", "home", 1, 65536, 16, 10, 2000);
        } else if (ns.getServerMaxRam("home") >= 32768 && ns.getServerMaxRam("home") < 262144){
            ns.exec("/hive/swarm.js", "home", 1, 524288, 64, 100, 1000);
        } else if (ns.getServerMaxRam("home") >= 262144){
            ns.exec("/hive/swarm.js", "home", 1, 5242880, 256, 100, 100);
        }
        return ns.getServerMaxRam("home");
    }
}

async function spinUpGang(ns){
    let isReady = false;
    let isDone = false;
    let inSlumSnakes = false;
    let mooks = ["Bumble", "Killer", "Mason", "Honey", "Sugarbag", "Sweat", "Carpenter", "Digger", "Longhorn", "Cuckoo", "Squash", "Cutter"]
    let othergangarray = ["Speakers for the Dead", "The Syndicate", "NiteSec", "The Black Hand", "The Dark Army"];
    let numSleeves = ns.sleeve.getNumSleeves();
    let availableFactions = ns.singularity.checkFactionInvitations();
    let joinedFactions = ns.getPlayer().factions;

    if (joinedFactions.includes("Slum Snakes")){
        inSlumSnakes = true;
    }
    if (ns.singularity.getCrimeChance("Homicide") > 0.6){
        isReady = true;
    }
    if (ns.heart.break() <= -54000){
        isDone = true;
    }

    if(availableFactions.includes("Slum Snakes") &!inSlumSnakes){
        ns.singularity.joinFaction("Slum Snakes");
        inSlumSnakes = true;
    }

    if (inSlumSnakes && isDone){
        if (!ns.gang.inGang()){
            ns.gang.createGang("Slum Snakes");
            ns.gang.recruitMember("Bumble");
            ns.gang.recruitMember("Killer");
            ns.gang.recruitMember("Mason");
        }
        let sleeveActions = ["str", "def", "dex", "agi", "Algorithms", "Leadership", "Leadership", "Algorithms"];
        let equipment = ns.gang.getEquipmentNames();
        let members = ns.gang.getMemberNames();
        let fullup = true;
        for (let i = 0; i < numSleeves; ++i){
            let sleeveAction = sleeveActions[i];
            if (i < 4){
                ns.sleeve.travel(i, "Sector-12");
                ns.sleeve.setToGymWorkout(i, "Powerhouse Gym", sleeveAction);
            } else {
                ns.sleeve.travel(i, "Volhaven");
                ns.sleeve.setToUniversityCourse(i, "ZB Institute of Technology", sleeveAction);
            }
        }
        for (let i = 0; i < members.length; ++i){
            let gangdata = ns.gang.getMemberInformation(members[i]);
            if (gangdata.str_asc_mult >= 4 && gangdata.upgrades.length < 21){
                fullup = false;
            }
        }
        let otherganginfo = ns.gang.getOtherGangInformation();
        let maxpower = 0;
        for (let i = 0; i < othergangarray.length; ++i){
            if (otherganginfo[othergangarray[i]]["power"] > maxpower){
                maxpower = otherganginfo[othergangarray[i]]["power"];
            }
        }
        let mygang = ns.gang.getGangInformation();
        let mypower = mygang.power;

        for (let i = 0; i < members.length; ++i){
            let gangdata = ns.gang.getMemberInformation(members[i]);
            if (gangdata.dex >= 110 && gangdata.str_asc_mult == 1){
                ns.gang.ascendMember(members[i]);
                ns.gang.setMemberTask(members[i], "Train Combat");
            } else if (gangdata.dex >= 225 && gangdata.str_asc_mult > 1 && gangdata.str_asc_mult < 3){
                ns.gang.ascendMember(members[i]);
                ns.gang.setMemberTask(members[i], "Train Combat");
            } else if (gangdata.dex >= 350 && gangdata.str_asc_mult > 3 && gangdata.str_asc_mult < 4){
                ns.gang.ascendMember(members[i]);
                ns.gang.setMemberTask(members[i], "Train Combat")
            } else {
                if (members.length < 12 && gangdata.str > 500){
                    ns.gang.setMemberTask(members[i], "Terrorism");
                } else if (members.length == 12 && gangdata.str > 500 && !fullup){
                    ns.gang.setMemberTask(members[i], "Human Trafficking");
                } else if (members.length == 12 && gangdata.str > 500 && fullup){
                    if (mypower < maxpower * 4 && mygang.territory < 1){
                        ns.gang.setTerritoryWarfare(false);
                        ns.gang.setMemberTask(members[i], "Territory Warfare");
                    } else {
                        ns.gang.setMemberTask(members[i], "Human Trafficking");
                        ns.gang.setTerritoryWarfare(true);
                    }
                    let ascr = await ns.gang.getAscensionResult(members[i]);
                    await ns.sleep(500);
                    if (typeof ascr.str !== "undefined"){
                        if (ascr.str >= 2 || ascr.def >= 2 || ascr.agi >= 2 || ascr.dex >= 2){
                            await ns.gang.ascendMember(members[i]);
                        }
                    }
                }
                else if (gangdata.str < 500) {
                    ns.gang.setMemberTask(members[i], "Train Combat");
                } else {
                    ns.gang.setMemberTask(members[i], "Train Combat");
                }
            }
        }
        if (members.length < 12 && ns.gang.canRecruitMember()){
            for (let i = 0; i < mooks.length; ++i){
                if (!members.includes(mooks[i])){
                    ns.gang.recruitMember(mooks[i]);
                    break;
                }
            }
        }
        for (let i = 0; i < members.length; ++i){
            let gangdata = ns.gang.getMemberInformation(members[i]);
            if (gangdata.str_asc_mult >= 4){
                let curEquipment = gangdata.upgrades;
                let curAugments = gangdata.upgrades;
                for (let j = 0; j < equipment.length; ++j){
                    let curCash = ns.getServerMoneyAvailable("home");
                    let equipmentCost = ns.gang.getEquipmentCost(equipment[j]);
                    if (!curEquipment.includes(equipment[j]) && !curAugments.includes(equipment[j]) && equipmentCost < curCash){
                        ns.gang.purchaseEquipment(members[i], equipment[j]);
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < numSleeves; ++i){
            let sleevedata = ns.sleeve.getSleeve(i);
            if (sleevedata.shock > 0){
                ns.sleeve.setToShockRecovery(i);
            } else {
                if (sleevedata.skills.strength < 75){
                ns.sleeve.setToCommitCrime(i, "Mug");
                } else {
                ns.sleeve.setToCommitCrime(i, "Homicide");
                }
            }
        }
        if (isReady){
            ns.singularity.commitCrime("Homicide");
        } else {
            ns.singularity.commitCrime("Mug");
        }
    }
}

function buyGangAugs(ns){
    let gangAugs = ns.singularity.getAugmentationsFromFaction("Slum Snakes");
    let resortedGangAugs = [];

    for (let i = 0; i < gangAugs.length; ++i){
        if (!ownedAugs.includes(gangAugs[i])){
            let augCost = ns.singularity.getAugmentationPrice(gangAugs[i]);
            let obj = {};
            obj.cost = augCost;
            obj.name = gangAugs[i];
            resortedGangAugs.push(obj);
        }
    }
    resortedGangAugs.sort((a, b) => {
        const aValue = JSON.stringify(Object.values(a).sort());
        const bValue = JSON.stringify(Object.values(b).sort());
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    });
    for (let i = 0; i < resortedGangAugs.length; ++i){
        let curCash = ns.getServerMoneyAvailable("home");
        if (curCash > resortedGangAugs[i].cost){
            ns.singularity.purchaseAugmentation("Slum Snakes", resortedGangAugs[i].name);
        }
    }
    ns.singularity.installAugmentations("singularity/postaug.js");
}