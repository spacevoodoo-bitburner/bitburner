export async function main(ns){
    ns.exec("/singularity/nodestartup.js", "home");
    while (ns.getServerMaxRam("home") < 256){
        ns.singularity.upgradeHomeRam();
        await ns.sleep(1000);
    }
    ns.exec("/basic/killall.js", "home");
    ns.killall("home", true);
    ns.exec("/singularity/spinup.js", "home", 1, "gang", "hive");
}