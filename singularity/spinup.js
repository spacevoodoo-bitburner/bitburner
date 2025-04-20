export async function main(ns) {
    let iskilling = false;
    let inSlumSnakes = false;
    let inDaedalus = false;
    let isWorking = false;
    let karma = 0;
    let dwPrograms = ns.singularity.getDarkwebPrograms();
    let curCash = ns.getServerMoneyAvailable("home");
    let hasTor = false;
    let hiveresets = 0;
    let goingForCrash = false;
    if (curCash > 200000 && !hasTor){
        ns.singularity.purchaseTor();
        hasTor = true;
    }
    if (hasTor){
        dwPrograms = ns.singularity.getDarkwebPrograms();
        for (let i = 0; i < dwPrograms.length; ++i){
            let programCost = ns.singularity.getDarkwebProgramCost(dwPrograms[i]);
            if (hasTor && curCash > programCost){
                ns.singularity.purchaseProgram(dwPrograms[i]);
            }
        }
    }
    
    ns.singularity.commitCrime("Mug");

    //if the hive is enabled, start it up with parameters appropriate to server size
    if (ns.args.includes("hive")){
        if (ns.getServerMaxRam("home") < 4096){
            ns.exec("/hive/swarm.js", "home", 1, 8192, 1, 2, 5000);
        } else if (ns.getServerMaxRam("home") >= 4096 && ns.getServerMaxRam("home") < 32768){
            ns.exec("/hive/swarm.js", "home", 1, 65536, 16, 10, 2000);
        } else if (ns.getServerMaxRam("home") >= 32768 && ns.getServerMaxRam("home") < 262144){
            ns.exec("/hive/swarm.js", "home", 1, 524288, 64, 100, 1000);
        } else if (ns.getServerMaxRam("home") >= 262144){
            ns.exec("/hive/swarm.js", "home", 1, 5242880, 256, 100, 100);
        }
    }

    //if gang is enabled start up gang script and set sleeves to karma farming
    if (ns.args.includes("gang")){
        ns.exec("/gang/startup_combat.js", "home");
        ns.exec("/sleeve/murderhobos.js", "home");
    }

    while (true){
        await ns.sleep(200);
        let ownedAugs = ns.singularity.getOwnedAugmentations();
        curCash = ns.getServerMoneyAvailable("home");
        let availableFactions = ns.singularity.checkFactionInvitations();
        karma = ns.heart.break();

        if (availableFactions.includes("Daedalus") && !inDaedalus){
            ns.singularity.joinFaction("Daedalus");
            inDaedalus = true;
        }
        if (inDaedalus && !isWorking){
            ns.singularity.workForFaction("Daedalus", "field");
            ns.sleeve.setToFactionWork(0, "Daedalus", "field");
            isWorking = true;
        }
        if (inDaedalus && isWorking){
            let redpillrep = ns.singularity.getAugmentationRepReq("The Red Pill");
            let curDaedalusRep = ns.singularity.getFactionRep("Daedalus");
            if (curDaedalusRep >= redpillrep){
                ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill");
                ns.singularity.installAugmentations("/singularity/postaug.js");
            }
        }
        if (ownedAugs.includes("The Red Pill") && !goingForCrash){
            ns.exec("/sleeve/trainhack.js", "home");
            ns.singularity.travelToCity("Volhaven");
            ns.singularity.universityCourse("ZB Institute of Technology", "Algorithms");
            goingForCrash = true;
        }

        //if gang is enabled, check each cycle to see if you meet the requirements to start a gang.  If you don't
        //do the thing you need to do to meet those requirements.  If you do, then the gang script has already started one
        //so switch back to default behaviors.
        if (ns.args.includes("gang")){
            if(!inSlumSnakes && availableFactions.includes("Slum Snakes")){
                ns.singularity.joinFaction("Slum Snakes");
                inSlumSnakes = true;
            }
            let murderchance = ns.singularity.getCrimeChance("Homicide");
            if (!iskilling && karma > -54000 && murderchance > 0.6){
                ns.singularity.commitCrime("Homicide");
                iskilling = true;
            }
            if (iskilling && karma <= -54000){
                ns.singularity.commitCrime("Mug");
                ns.scriptKill("/sleeve/murderhobos.js", "home");
                ns.exec("/sleeve/trainup.js", "home");
                iskilling = false;
            }
            if (karma <= -54000){
                let gangAugs = ns.singularity.getAugmentationsFromFaction("Slum Snakes");
                let totalAugCost = 0;
                for (let i = 0; i < gangAugs.length; ++i){
                    if (!ownedAugs.includes(gangAugs[i])){
                        let augCost = ns.singularity.getAugmentationPrice(gangAugs[i]);
                        totalAugCost += augCost;
                    }
                }
                if (curCash > totalAugCost){
                    for (let i = 0; i < gangAugs.length; ++i){
                        curCash = ns.getServerMoneyAvailable("home");
                        if (!ownedAugs.includes(gangAugs[i]) && curCash > ns.singularity.getAugmentationPrice(gangAugs[i])){
                            ns.singularity.purchaseAugmentation("Slum Snakes", gangAugs[i]);
                        }
                    }
                }
                if (ns.args.includes("gangreset")){
                    let hasAll = true;
                    for (let i = 0; i < gangAugs.length; ++i){
                        if (!ownedAugs.includes(gangAugs[i])){
                            hasAll = false;
                        }
                    }
                    if (hasAll){
                        ns.singularity.installAugmentations("singularity/postaug.js");
                    }
                }
            }
        }

        //if the hive is enabled then perform upgrades and resets as necessary to keep it running optimally
        if (ns.args.includes("hive")){
            if (curCash > 200000 && !hasTor){
                ns.singularity.purchaseTor();
                hasTor = true;
            }
            if (curCash > ns.singularity.getUpgradeHomeRamCost() && ns.getServerMaxRam("home") < 1048576){
                ns.singularity.upgradeHomeRam();
            }
            if (curCash > ns.singularity.getUpgradeHomeCoresCost()){
                ns.singularity.upgradeHomeCores();
            }
            for (let i = 0; i < dwPrograms.length; ++i){
                let programCost = ns.singularity.getDarkwebProgramCost(dwPrograms[i]);
                if (hasTor && curCash > programCost){
                    ns.singularity.purchaseProgram(dwPrograms[i]);
                }
            }

            if (ns.getServerMaxRam("home") >= 4096 && ns.getServerMaxRam("home") < 32768 && hiveresets == 0){
                ns.exec("/basic/killall.js", "home");
                ns.killall("home", true);
                if (ns.args.includes("gang")){
                    ns.exec("/gang/startup_combat.js", "home");
                    if (karma > -54000){
                        ns.exec("/sleeve/murderhobos.js", "home");
                    }
                }
                ns.exec("/hive/swarm.js", "home", 1, 65536, 16, 10, 2000);
                hiveresets += 1;
            } else if (ns.getServerMaxRam("home") >= 32768 && ns.getServerMaxRam("home") < 262144 && hiveresets == 1){
                ns.exec("/basic/killall.js", "home");
                ns.killall("home", true);
                if (ns.args.includes("gang")){
                    ns.exec("/gang/startup_combat.js", "home");
                    if (karma > -54000){
                        ns.exec("/sleeve/murderhobos.js", "home");
                    }
                }
                ns.exec("/hive/swarm.js", "home", 1, 524288, 64, 100, 500);
                hiveresets += 1;
            } else if (ns.getServerMaxRam("home") >= 262144 && hiveresets == 2){
                ns.exec("/basic/killall.js", "home");
                ns.killall("home", true);
                if (ns.args.includes("gang")){
                    ns.exec("/gang/startup_combat.js", "home");
                    if (karma > -54000){
                        ns.exec("/sleeve/murderhobos.js", "home");
                    }
                }
                ns.exec("/hive/swarm.js", "home", 1, 5242880, 256, 100, 100);
                hiveresets += 1;
            }
        }
    }
}