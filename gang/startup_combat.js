export async function main(ns) {
  let mooks = ["Honey", "Sugarbag", "Sweat", "Carpenter", "Digger", "Longhorn", "Cuckoo", "Squash", "Cutter"]
  let mookindex = 0;
  let karma = ns.heart.break();
  let othergangarray = ["Speakers for the Dead", "The Syndicate", "NiteSec", "The Black Hand", "The Dark Army"];
  
  //if you don't meet the karma requirements to start a gang then wait until you do
  while (karma > -54000){
    karma = ns.heart.break();
    ns.tprint(karma);
    await ns.sleep(600000)
  }
  //If you meet the requirements but aren't in a gang then create one and recruit the first 3 members
  if (!ns.gang.inGang()){
    ns.gang.createGang("Slum Snakes");
    ns.gang.recruitMember("Bumble");
    ns.gang.recruitMember("Killer");
    ns.gang.recruitMember("Mason");
  }
  //If you are in a gang then do gang stuff
  while (karma <= -54000 && ns.gang.inGang()){
    let equipment = ns.gang.getEquipmentNames();
    let members = ns.gang.getMemberNames();
    //true if all non-augmentation equipment has been purchased for all members.  False otherwise.
    //note: once you start buying augmentations, this no longer functions because the max equipment count
    //is hard coded.  This doesn't actually matter though because once you are buying augs you have enough money
    //to fully equip every member on each ascenssion, which the script still handles fine, so the fullup check
    //really only matters in the early game before you are pulling in billions per second to help you split your
    //attention appropriately between money and power farming.
    let fullup = true;
    for (let i = 0; i < members.length; ++i){
      let gangdata = ns.gang.getMemberInformation(members[i]);
      if (gangdata.str_asc_mult >= 4 && gangdata.upgrades.length < 21){
        fullup = false;
      }
    }

    //track the power of the other gangs so you know when to enable clashes
    let otherganginfo = ns.gang.getOtherGangInformation();
    let maxpower = 0;
    for (let i = 0; i < othergangarray.length; ++i){
      if (otherganginfo[othergangarray[i]]["power"] > maxpower){
        maxpower = otherganginfo[othergangarray[i]]["power"];
      }
    }
    let mygang = ns.gang.getGangInformation();
    let mypower = mygang.power;

    //if a gang member is too weak to do things, train/ascend them until they are useful.
    //if they are useful and the gang isn't full yet, set them to reputation farming.
    //if they are useful and the gang is full, but somebody isn't fully equipped, set them to money farming.
    //if they are useful, fully equipped, and fully manned, set to territory warfare until you are ready to take over
    //if you are ready to take over, set back to cash farming so your mooks don't die and enable territory clashes
    //Don't ascend again after train up until everything else is squared away.  If everyone is good, ascend each time it would double a multiplier
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
          if (mypower < maxpower * 4){
            ns.gang.setTerritoryWarfare(false);
            ns.gang.setMemberTask(members[i], "Territory Warfare");
          } else {
            ns.gang.setMemberTask(members[i], "Human Trafficking");
            ns.gang.setTerritoryWarfare(true);
          }
          let asc = ns.gang.getAscensionResult(members[i]);
          if (asc.str >= 2 || asc.cha >= 2 || asc.def >= 2 || asc.agi >= 2 || asc.dex >= 2 || asc.hack >= 2){
            ns.gang.ascendMember(members[i]);
          }
        }
        else if (gangdata.str < 500) {
          ns.gang.setMemberTask(members[i], "Train Combat");
        } else {
          ns.gang.setMemberTask(members[i], "Train Combat");
        }
      }
    }

    //recruit if you can and aren't full.
    if (members.length < 12 && ns.gang.canRecruitMember()){
      ns.gang.recruitMember(mooks[mookindex]);
      mookindex += 1;
    }

    //Buy anything you can afford for anyone who doesn't have it so long as they have completed their initial training cycles
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
    await ns.sleep(10000);
  }
}