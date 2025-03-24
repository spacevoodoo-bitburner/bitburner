import { scanall } from "/basic/scanner.js";

export async function main(ns) {
  const hackableservers = scanall(ns);
  const purchasedservers = ns.getPurchasedServers();
  ns.killall("home", true);
  for (let i = 0; i < hackableservers.length; ++i){
    ns.killall(hackableservers[i]["name"]);
  }
  for (let i = 0; i < purchasedservers.length; ++i){
    ns.killall(purchasedservers[i]);
  }
  await ns.sleep(200);
  ns.exec("/hive/swarm.js", "home");
}