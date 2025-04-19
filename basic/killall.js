import { scanall } from "/basic/scanner.js";

export async function main(ns) {
  const servers = await scanall(ns);
  const pservers = ns.getPurchasedServers();
  for (let i = 0; i < pservers.length; ++i){
    ns.killall(pservers[i]);
  }
  for (let i = 0; i < servers.length; ++i){
    let target = servers[i]["name"];
    ns.killall(target, true);
  }
  for (let i = 1; i < 500000; ++i){
    ns.clearPort(i);
  }
}