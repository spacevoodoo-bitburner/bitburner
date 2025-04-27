export async function main(ns) {
    while (true){
      let h = ns.hacknet.numHashes();
      let c = ns.hacknet.hashCapacity();
      if (h > c - ns.args[0]){
        ns.hacknet.spendHashes("Sell for Money", "", ns.args[1]);
      }
      await ns.sleep(1000);
    }
  }