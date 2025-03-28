const pokemonData = [
  {
    "Name": "Cinderace",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "Single-Target",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Garchomp",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Gengar",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Cramorant",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Alolan-Ninetales",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Wigglytuff",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Small-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Buffer",
    "OtherAttr": "Anti-CC"
  },
  {
    "Name": "Machamp",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "SplitMap",
    "Classification": "Engage",
    "OtherAttr": "Anti-CC"
  },
  {
    "Name": "Absol",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Slowbro",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Drain Tank",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Mr-Mime",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Venusaur",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "High",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Large-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Lucario",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Large-AOE",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": ""
  },
  {
    "Name": "Talonflame",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Eldegoss",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Single-Target",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Healer"
  },
  {
    "Name": "Greninja",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "None",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "ADC"
  },
  {
    "Name": "Crustle",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Snorlax",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Charizard",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Engage"
  },
  {
    "Name": "Pikachu",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Zeraora",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Gardevoir",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "None",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Blissey",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Healer"
  },
  {
    "Name": "Blastoise",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Large-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Mamoswine",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Sylveon",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Greedent",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Bruiser"
  },
  {
    "Name": "Decidueye",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "High",
    "Bulk": "None",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Poke",
    "Classification": "BurstMage"
  },
  {
    "Name": "Tsareena",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Bruiser"
  },
  {
    "Name": "Dragonite",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Single-Target",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Trevenant",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Large-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Aegislash",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Hoopa",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Large-AOE",
    "CC": "Medium",
    "PlayStyle": "Assist",
    "Classification": "Healer"
  },
  {
    "Name": "Duraludon",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "None",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Single-Target",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Azumarill",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Single-Target",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Bruiser"
  },
  {
    "Name": "Espeon",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "None",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Delphox",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Large-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Glaceon",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "None",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Buzzwole",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Tyranitar",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Mew",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Assist",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Dodrio",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Single-Target",
    "CC": "Medium",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Scizor",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Scyther",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Clefable",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "N/A",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Healer"
  },
  {
    "Name": "Zoroark",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Sableye",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Engage"
  },
  {
    "Name": "Urshifu-SS",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Urshifu-RS",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Dragapult",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "Small-AOE",
    "CC": "None",
    "PlayStyle": "Poke",
    "Classification": "ADC"
  },
  {
    "Name": "Comfey",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "High",
    "PlayStyle": "Dive",
    "Classification": "Healer"
  },
  {
    "Name": "Zacian",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Goodra",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Lapras",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Large-AOE",
    "CC": "Medium",
    "PlayStyle": "SplitMap",
    "Classification": "Drain Tank"
  },
  {
    "Name": "Chandelure",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Umbreon",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Leafeon",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Inteleon",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "High",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "None",
    "PlayStyle": "Poke",
    "Classification": "BurstMage"
  },
  {
    "Name": "Mewtwo-Y",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Mewtwo-X",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "High",
    "PlayStyle": "Assist",
    "Classification": "Engage"
  },
  {
    "Name": "Blaziken",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Mimikyu",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "High",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Single-Target",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Meowscarada",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Metagross",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Gyarados",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "N/A",
    "DamageAffect": "Small-AOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Engage"
  },
  {
    "Name": "Miraidon",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "High",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Falinks",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Ceruledge",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Ho-Oh",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Drain Tank"
  },
  {
    "Name": "Armarouge",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Utility Mage"
  },
  {
    "Name": "Darkrai",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Psyduck",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "Large-AOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Tinkaton",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Medium-AOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Galarian-Rapidash",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "Small-AOE",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  }
];

module.exports = pokemonData;