// All the basic naming conventions of things. Keeping as const cause naming conventions may change. For example: Alolan Ninetales could be A-Ninetales, Alolan_Ninetales, etc
// Also just makes it easier to prevent typos and just change stuff as needed.

// Pokemon
const constants = {
    CINDERACE_NAME: 'Cinderace',
    GARCHOMP_NAME: 'Garchomp',
    GENGAR_NAME: 'Gengar',
    CRAMORANT_NAME: 'Cramorant', 
    ALOLANNINETALES_NAME: 'Alolan-Ninetales',
    WIGGLYTUFF_NAME: 'Wigglytuff',
    MACHAMP_NAME: 'Machamp', 
    ABSOL_NAME: 'Absol',
    SLOWBRO_NAME: 'Slowbro',
    MRMIME_NAME: 'Mr-Mime', 
    VENUSAUR_NAME: 'Venusaur', 
    LUCARIO_NAME: 'Lucario',
    TALONFLAME_NAME: 'Talonflame',
    ELDEGOSS_NAME: 'Eldegoss', 
    GRENINJA_NAME: 'Greninja', 
    CRUSTLE_NAME: 'Crustle',
    SNORLAX_NAME: 'Snorlax', 
    CHARIZARD_NAME: 'Charizard', 
    PIKACHU_NAME: 'Pikachu', 
    ZERAORA_NAME: 'Zeraora', 
    GARDEVOIR_NAME: 'Gardevoir',
    BLISSEY_NAME: 'Blissey', 
    BLASTOISE_NAME: 'Blastoise', 
    MAMOSWINE_NAME: 'Mamoswine', 
    SYLVEON_NAME: 'Sylveon', 
    GREEDENT_NAME: 'Greedent', 
    DECIDUEYE_NAME: 'Decidueye', 
    TSAREENA_NAME: 'Tsareena', 
    DRAGONITE_NAME: 'Dragonite', 
    TREVENANT_NAME: 'Trevenant',
    AEGISLASH_NAME: 'Aegislash', 
    HOOPA_NAME: 'Hoopa', 
    DURALUDON_NAME: 'Duraludon',
    AZUMARILL_NAME: 'Azumarill',
    ESPEON_NAME: 'Espeon',
    DELPHOX_NAME: 'Delphox', 
    GLACEON_NAME: 'Glaceon', 
    BUZZWOLE_NAME: 'Buzzwole', 
    TYRANITAR_NAME: 'Tyranitar',
    MEW_NAME: 'Mew',
    DODRIO_NAME: 'Dodrio',
    SCIZOR_NAME: 'Scizor',
    SCYTHER_NAME: 'Scyther',
    CLEFABLE_NAME: 'Clefable',
    ZOROARK_NAME: 'Zoroark',
    SABLEYE_NAME: 'Sableye',
    URSHIFUSS_NAME: 'Urshifu-SS', // Single-Strike (Red)
    URSHIFURS_NAME: 'Urshifu-RS', // Rapid-Strike (Blue)
    DRAGAPULT_NAME: 'Dragapult',
    COMFEY_NAME: 'Comfey',
    ZACIAN_NAME: 'Zacian',
    GOODRA_NAME: 'Goodra',
    LAPRAS_NAME: 'Lapras',
    CHANDELURE_NAME: 'Chandelure',
    UMBREON_NAME: 'Umbreon',
    LEAFEON_NAME: 'Leafeon',
    INTELEON_NAME: 'Inteleon',
    MEWTWOY_NAME: 'Mewtwo-Y',
    MEWTWOX_NAME: 'Mewtwo-X',
    BLAZIKEN_NAME: 'Blaziken',
    MIMIKYU_NAME: 'Mimikyu',
    MEOWSCARADA_NAME: 'Meowscarada',
    METAGROSS_NAME: 'Metagross',
    GYARADOS_NAME: 'Gyarados',
    MIRAIDON_NAME: 'Miraidon',
    FALINKS_NAME: 'Falinks',
    CERULEDGE_NAME: 'Ceruledge',
    HOOH_NAME: 'Ho-Oh',

    // Moves
    CINDERACE_MOVE_1A_PYROBALL: 'Pyro Ball',
    CINDERACE_MOVE_1B_BLAZEKICK: 'Blaze Kick',
    CINDERACE_MOVE_2A_LOWSWEEP: 'Low Sweep',
    CINDERACE_MOVE_2B_FEINT: 'Feint',
    GARCHOMP_MOVE_1A_DIG: 'Dig',
    GARCHOMP_MOVE_1B_DRAGONRUSH: 'Dragon Rush',
    GARCHOMP_MOVE_2A_EARTHQUAKE: 'Earthquake',
    GARCHOMP_MOVE_2B_DRAGONCLAW: 'Dragon Claw',
    GENGAR_MOVE_1A_SHADOWBALL: 'Shadow Ball',
    GENGAR_MOVE_1B_SLUDGEBOMB: 'Sludge Bomb',
    GENGAR_MOVE_2A_DREAMEATER: 'Dream Eater',
    GENGAR_MOVE_2B_HEX: 'Hex',
    CRAMORANT_MOVE_1A_SURF: 'Surf',
    CRAMORANT_MOVE_1B_DIVE: 'Dive',
    CRAMORANT_MOVE_2A_HURRICANE: 'Hurricane',
    CRAMORANT_MOVE_2B_AIRSLASH: 'Air Slash',
    ALOLANNINETALES_MOVE_1A_AVALANCHE: 'Avalanche',
    ALOLANNINETALES_MOVE_1B_DAZZLINGGLEAM: 'Dazzling Gleam',
    ALOLANNINETALES_MOVE_2A_BLIZZARD: 'Blizzard',
    ALOLANNINETALES_MOVE_2B_AURORAVEIL: 'Aurora Veil',
    WIGGLYTUFF_MOVE_1A_DOUBLESLAP: 'Double Slap',
    WIGGLYTUFF_MOVE_1B_DAZZLINGGLEAM: 'Dazzling Gleam',
    WIGGLYTUFF_MOVE_2A_ROLLOUT: 'Rollout',
    WIGGLYTUFF_MOVE_2B_SING: 'Sing',
    MACHAMP_MOVE_1A_CLOSECOMBAT: 'Close Combat',
    MACHAMP_MOVE_1B_CROSSCHOP: 'Cross Chop',
    MACHAMP_MOVE_2A_DYNAMICPUNCH: 'Dynamic Punch',
    MACHAMP_MOVE_2B_SUBMISSION: 'Submission',
    ABSOL_MOVE_1A_NIGHTSLASH: 'Night Slash',
    ABSOL_MOVE_1B_PURSUIT: 'Pursuit',
    ABSOL_MOVE_2A_PSYCHOCUT: 'Psycho Cut',
    ABSOL_MOVE_2B_SUCKERPUNCH: 'Sucker Punch',
    SLOWBRO_MOVE_1A_SCALD: 'Scald',
    SLOWBRO_MOVE_1B_SURF: 'Surf',
    SLOWBRO_MOVE_2A_AMNESIA: 'Amnesia',
    SLOWBRO_MOVE_2B_TELEKINESIS: 'Telekinesis',
    MRMIME_MOVE_1A_CONFUSION: 'Confusion',
    MRMIME_MOVE_1B_PSYCHIC: 'Psychic',
    MRMIME_MOVE_2A_BARRIER: 'Barrier',
    MRMIME_MOVE_2B_POWERSWAP: 'Power Swap',
    VENUSAUR_MOVE_1A_SLUDGEBOMB: 'Sludge Bomb',
    VENUSAUR_MOVE_1B_GIGADRAIN: 'Giga Drain',
    VENUSAUR_MOVE_2A_SOLARBEAM: 'Solarbeam',
    VENUSAUR_MOVE_2B_PETALDANCE: 'Petal Dance',
    LUCARIO_MOVE_1A_EXTREMESPEED: 'Extreme Speed',
    LUCARIO_MOVE_1B_POWERUPPUNCH: 'Power-Up Punch',
    LUCARIO_MOVE_2A_BONERUSH: 'Bone Rush',
    LUCARIO_MOVE_2B_CLOSECOMBAT: 'Close Combat',
    TALONFLAME_MOVE_1A_FLAMECHARGE: 'Flame Charge',
    TALONFLAME_MOVE_1B_AERIALACE: 'Aerial Ace',
    TALONFLAME_MOVE_2A_FLY: 'Fly',
    TALONFLAME_MOVE_2B_BRAVEBIRD: 'Brave Bird',
    ELDEGOSS_MOVE_1A_POLLENPUFF: 'Pollen Puff',
    ELDEGOSS_MOVE_1B_LEAFTORNADO: 'Leaf Tornado',
    ELDEGOSS_MOVE_2A_COTTONGUARD: 'Cotton Guard',
    ELDEGOSS_MOVE_2B_COTTONSPORE: 'Cotton Spore',
    GRENINJA_MOVE_1A_WATERSHURIKEN: 'Water Shuriken',
    GRENINJA_MOVE_1B_SURF: 'Surf',
    GRENINJA_MOVE_2A_DOUBLETEAM: 'Double Team',
    GRENINJA_MOVE_2B_SMOKESCREEN: 'Smokescreen',
    CRUSTLE_MOVE_1A_ROCKTOMB: 'Rock Tomb',
    CRUSTLE_MOVE_1B_SHELLSMASH: 'Shell Smash',
    CRUSTLE_MOVE_2A_STEALTHROCK: 'Stealth Rock',
    CRUSTLE_MOVE_2B_XSCISSOR: 'X-Scissor',
    SNORLAX_MOVE_1A_HEAVYSLAM: 'Heavy Slam',
    SNORLAX_MOVE_1B_FLAIL: 'Flail',
    SNORLAX_MOVE_2A_BLOCK: 'Block',
    SNORLAX_MOVE_2B_YAWN: 'Yawn',
    CHARIZARD_MOVE_1A_FLAMETHROWER: 'Flamethrower',
    CHARIZARD_MOVE_1B_FIREPUNCH: 'Fire Punch',
    CHARIZARD_MOVE_2A_FIREBLAST: 'Fire Blast',
    CHARIZARD_MOVE_2B_FLAREBLITZ: 'Flare Blitz',
    PIKACHU_MOVE_1A_ELECTROBALL: 'Electro Ball',
    PIKACHU_MOVE_1B_THUNDER: 'Thunder',
    PIKACHU_MOVE_2A_VOLTTACKLE: 'Volt Tackle',
    PIKACHU_MOVE_2B_THUNDERBOLT: 'Thunderbolt',
    ZERAORA_MOVE_1A_VOLTSWITCH: 'Volt Switch',
    ZERAORA_MOVE_1B_SPARK: 'Spark',
    ZERAORA_MOVE_2A_DISCHARGE: 'Discharge',
    ZERAORA_MOVE_2B_WILDCHARGE: 'Wild Charge',
    GARDEVOIR_MOVE_1A_PSYCHIC: 'Psychic',
    GARDEVOIR_MOVE_1B_MOONBLAST: 'Moonblast',
    GARDEVOIR_MOVE_2A_PSYSHOCK: 'Psyshock',
    GARDEVOIR_MOVE_2B_FUTURESIGHT: 'Future Sight',
    BLISSEY_MOVE_1A_EGGBOMB: 'Egg Bomb',
    BLISSEY_MOVE_1B_HELPINGHAND: 'Helping Hand',
    BLISSEY_MOVE_2A_SOFTBOILED: 'Soft-Boiled',
    BLISSEY_MOVE_2B_SAFEGUARD: 'Safeguard',
    BLASTOISE_MOVE_1A_HYDROPUMP: 'Hydro Pump',
    BLASTOISE_MOVE_1B_WATERSPOUT: 'Water Spout',
    BLASTOISE_MOVE_2A_SURF: 'Surf',
    BLASTOISE_MOVE_2B_RAPIDSPIN: 'Rapid Spin',
    MAMOSWINE_MOVE_1A_ICICLECRASH: 'Icicle Crash',
    MAMOSWINE_MOVE_1B_ICEFANG: 'Ice Fang',
    MAMOSWINE_MOVE_2A_HIGHHORSEPOWER: 'High Horsepower',
    MAMOSWINE_MOVE_2B_EARTHQUAKE: 'Earthquake',
    SYLVEON_MOVE_1A_MYSTICALFIRE: 'Mystical Fire',
    SYLVEON_MOVE_1B_HYPERVOICE: 'Hyper Voice',
    SYLVEON_MOVE_2A_DRAININGKISS: 'Draining Kiss',
    SYLVEON_MOVE_2B_CALMMIND: 'Calm Mind',
    GREEDENT_MOVE_1A_BULLETSEED: 'Bullet Seed',
    GREEDENT_MOVE_1B_BELCH: 'Belch',
    GREEDENT_MOVE_2A_STUFFCHEEKS: 'Stuff Cheeks',
    GREEDENT_MOVE_2B_COVET: 'Covet',
    DECIDUEYE_MOVE_1A_RAZORLEAF: 'Razor Leaf',
    DECIDUEYE_MOVE_1B_SPIRITSHACKLE: 'Spirit Shackle',
    DECIDUEYE_MOVE_2A_LEAFSTORM: 'Leaf Storm',
    DECIDUEYE_MOVE_2B_SHADOWSNEAK: 'Shadow Sneak',
    TSAREENA_MOVE_1A_TRIPLEAXEL: 'Triple Axel',
    TSAREENA_MOVE_1B_STOMP: 'Stomp',
    TSAREENA_MOVE_2A_TROPKICK: 'Trop Kick',
    TSAREENA_MOVE_2B_GRASSYGLIDE: 'Grassy Glide',
    DRAGONITE_MOVE_1A_DRAGONDANCE: 'Dragon Dance',
    DRAGONITE_MOVE_1B_EXTREMESPEED: 'Extreme Speed',
    DRAGONITE_MOVE_2A_HYPERBEAM: 'Hyper Beam',
    DRAGONITE_MOVE_2B_OUTRAGE: 'Outrage',
    TREVENANT_MOVE_1A_WOODHAMMER: 'Wood Hammer',
    TREVENANT_MOVE_1B_CURSE: 'Curse',
    TREVENANT_MOVE_2A_HORNLEECH: 'Horn Leech',
    TREVENANT_MOVE_2B_PAINSPLIT: 'Pain Split',
    AEGISLASH_MOVE_1A_SACREDSWORD: 'Sacred Sword',
    AEGISLASH_MOVE_1B_SHADOWCLAW: 'Shadow Claw',
    AEGISLASH_MOVE_2A_WIDEGUARD: 'Wide Guard',
    AEGISLASH_MOVE_2B_IRONHEAD: 'Iron Head',
    HOOPA_MOVE_1A_PHANTOMFORCE: 'Phantom Force',
    HOOPA_MOVE_1B_SHADOWBALL: 'Shadow Ball',
    HOOPA_MOVE_2A_HYPERSPACEHOLE: 'Hyperspace Hole',
    HOOPA_MOVE_2B_TRICK: 'Trick',
    DURALUDON_MOVE_1A_FLASHCANNON: 'Flash Cannon',
    DURALUDON_MOVE_1B_DRAGONPULSE: 'Dragon Pulse',
    DURALUDON_MOVE_2A_DRAGONTAIL: 'Dragon Tail',
    DURALUDON_MOVE_2B_STEALTHROCK: 'Stealth Rock',
    AZUMARILL_MOVE_1A_PLAYROUGH: 'Play Rough',
    AZUMARILL_MOVE_1B_WATERPULSE: 'Water Pulse',
    AZUMARILL_MOVE_2A_WHIRLPOOL: 'Whirlpool',
    AZUMARILL_MOVE_2B_AQUATAIL: 'Aquatail',
    ESPEON_MOVE_1A_PSYSHOCK: 'Psyshock',
    ESPEON_MOVE_1B_STOREDPOWER: 'Stored Power',
    ESPEON_MOVE_2A_PSYBEAM: 'Psybeam',
    ESPEON_MOVE_2B_FUTURESIGHT: 'Future Sight',
    DELPHOX_MOVE_1A_FIREBLAST: 'Fire Blast',
    DELPHOX_MOVE_1B_MYSTICALFIRE: 'Mystical Fire',
    DELPHOX_MOVE_2A_FIRESPIN: 'Fire Spin',
    DELPHOX_MOVE_2B_FLAMECHARGE: 'Flame Charge',
    GLACEON_MOVE_1A_ICICLESPEAR: 'Icicle Spear',
    GLACEON_MOVE_1B_ICYWIND: 'Icy Wind',
    GLACEON_MOVE_2A_ICESHARD: 'Ice Shard',
    GLACEON_MOVE_2B_FREEZEDRY: 'Freeze Dry',
    BUZZWOLE_MOVE_1A_LUNGE: 'Lunge',
    BUZZWOLE_MOVE_1B_SMACKDOWN: 'Smack Down',
    BUZZWOLE_MOVE_2A_LEECHLIFE: 'Leech Life',
    BUZZWOLE_MOVE_2B_SUPERPOWER: 'Superpower',
    TYRANITAR_MOVE_1A_DARKPULSE: 'Dark Pulse',
    TYRANITAR_MOVE_1B_STONEEDGE: 'Stone Edge',
    TYRANITAR_MOVE_2A_ANCIENTPOWER: 'Ancient Power',
    TYRANITAR_MOVE_2B_SANDTOMB: 'Sand Tomb',
    // Mew is a special case and will naturally be treated like she has all her moves
    DODRIO_MOVE_1A_TRIATTACK: 'Tri Attack',
    DODRIO_MOVE_1B_DRILLPECK: 'Drill Peck',
    DODRIO_MOVE_2A_AGILITY: 'Agility',
    DODRIO_MOVE_2B_JUMPKICK: 'Jump Kick',
    // Scizor and Scyther are special cases with one 1 move
    SCIZOR_MOVE_1A_BULLETPUNCH: 'Bullet Punch',
    SCIZOR_MOVE_2A_DOUBLEHIT: 'Double Hit',
    SCIZOR_MOVE_2B_SWORDSDANCE: 'Swords Dance',
    SCYTHER_MOVE_1A_DUALWINGBEAT: 'Dual Wingbeat',
    SCYTHER_MOVE_2A_DOUBLEHIT: 'Double Hit',
    SCYTHER_MOVE_2B_SWORDSDANCE: 'Swords Dance',
    CLEFABLE_MOVE_1A_MOONLIGHT: 'Moonlight',
    CLEFABLE_MOVE_1B_DRAININGKISS: 'Draining Kiss',
    CLEFABLE_MOVE_2A_GRAVITY: 'Gravity',
    CLEFABLE_MOVE_2B_FOLLOWME: 'Follow Me',
    ZOROARK_MOVE_1A_SHADOWCLAW: 'Shadow Claw',
    ZOROARK_MOVE_1B_CUT: 'Cut',
    ZOROARK_MOVE_2A_NIGHTSLASH: 'Night Slash',
    ZOROARK_MOVE_2B_FEINTATTACK: 'Feint Attack',
    SABLEYE_MOVE_1A_KNOCKOFF: 'Knock Off',
    SABLEYE_MOVE_1B_SHADOWSNEAK: 'Shadow Sneak',
    SABLEYE_MOVE_2A_FEINTATTACK: 'Feint Attack',
    SABLEYE_MOVE_2B_CONFUSERAY: 'Confuse Ray',
    // BOTH URSHIFUS ONLY HAVE ONE OPTION
    URSHIFUSS_MOVE_1A_WICKEDBLOW: 'Wicked Blow',
    URSHIFUSS_MOVE_2A_THROATCHOP: 'Throat Chop',
    URSHIFURS_MOVE_1A_SURGINGSTRIKES: 'Surging Strikes',
    URSHIFURS_MOVE_2A_LIQUIDATION: 'Liquidation',
    DRAGAPULT_MOVE_1A_DRAGONBREATH: 'Dragon Breath',
    DRAGAPULT_MOVE_1B_SHADOWBALL: 'Shadow Ball',
    DRAGAPULT_MOVE_2A_DRAGONDANCE: 'Dragon Dance',
    DRAGAPULT_MOVE_2B_PHANTOMFORCE: 'Phantom Force',
    COMFEY_MOVE_1A_FLORALHEALING: 'Floral Healing',
    COMFEY_MOVE_1B_SWEETKISS: 'Sweet Kiss',
    COMFEY_MOVE_2A_MAGICALLEAF: 'Magical Leaf',
    COMFEY_MOVE_2B_GRASSKNOT: 'Grass Knot',
    ZACIAN_MOVE_1A_METALCLAW: 'Metal Claw',
    ZACIAN_MOVE_1B_SACREDSWORD: 'Sacred Sword',
    ZACIAN_MOVE_2A_AGILITY: 'Agility',
    ZACIAN_MOVE_2B_PLAYROUGH: 'Play Rough',
    GOODRA_MOVE_1A_MUDDYWATER: 'Muddy Water',
    GOODRA_MOVE_1B_DRAGONPULSE: 'Dragon Pulse',
    GOODRA_MOVE_2A_POWERWHIP: 'Power Whip',
    GOODRA_MOVE_2B_ACIDSPRAY: 'Acid Spray',
    LAPRAS_MOVE_1A_WATERPULSE: 'Water Pulse',
    LAPRAS_MOVE_1B_PERISHSONG: 'Perish Song',
    LAPRAS_MOVE_2A_BUBBLEBEAM: 'Bubble Beam',
    LAPRAS_MOVE_2B_ICEBEAM: 'Ice Beam',
    CHANDELURE_MOVE_1A_FLAMETHROWER: 'Flamethrower',
    CHANDELURE_MOVE_1B_OVERHEAT: 'Overheat',
    CHANDELURE_MOVE_2A_POLTERGEIST: 'Poltergeist',
    CHANDELURE_MOVE_2B_IMPRISON: 'Imprison',
    UMBREON_MOVE_1A_MEANLOOK: 'Mean Look',
    UMBREON_MOVE_1B_FOULPLAY: 'Foul Play',
    UMBREON_MOVE_2A_WISH: 'Wish',
    UMBREON_MOVE_2B_SNARL: 'Snarl',
    LEAFEON_MOVE_1A_RAZORLEAF: 'Razor Leaf',
    LEAFEON_MOVE_1B_SOLARBLADE: 'Solar Blade',
    LEAFEON_MOVE_2A_AERIALACE: 'Aerial Ace',
    LEAFEON_MOVE_2B_LEAFBLADE: 'Leaf Blade',
    INTELEON_MOVE_1A_FELLSTINGER: 'Fell Stinger',
    INTELEON_MOVE_1B_ACROBATICS: 'Acrobatics',
    INTELEON_MOVE_2A_SNIPESHOT: 'Snipe Shot',
    INTELEON_MOVE_2B_LIQUIDATION: 'Liquidation',
    MEWTWOY_MOVE_1A_FUTURESIGHT: 'Future Sight',
    MEWTWOY_MOVE_1B_PSYSTRIKE: 'Psystrike',
    MEWTWOY_MOVE_2A_RECOVER: 'Recover',
    MEWTWOY_MOVE_2B_TELEPORT: 'Teleport',
    MEWTWOX_MOVE_1A_FUTURESIGHT: 'Future Sight',
    MEWTWOX_MOVE_1B_PSYSTRIKE: 'Psystrike',
    MEWTWOX_MOVE_2A_RECOVER: 'Recover',
    MEWTWOX_MOVE_2B_TELEPORT: 'Teleport',
    // Blaziken will be treated like Mew, like he has all his moves
    MIMIKYU_MOVE_1A_PLAYROUGH: 'Play Rought',
    MIMIKYU_MOVE_1B_SHADOWCLAW: 'Shadow Claw',
    MIMIKYU_MOVE_2A_SHADOWSNEAK: 'Shadow Sneak',
    MIMIKYU_MOVE_2B_TRICKROOM: 'Trick Room',
    MEOWSCARADA_MOVE_1A_FLOWERTRICK: 'Flower Trick',
    MEOWSCARADA_MOVE_1B_NIGHTSLASH: 'Night Slash',
    MEOWSCARADA_MOVE_2A_DOUBLETEAM: 'Double Team',
    MEOWSCARADA_MOVE_2B_TRAILBLAZE: 'Trailblaze',
    METAGROSS_MOVE_1A_METEORMASH: 'Meteor Mash',
    METAGROSS_MOVE_1B_GYROBALL: 'Gyro Ball',
    METAGROSS_MOVE_2A_ZENHEADBUTT: 'Zen Headbutt',
    METAGROSS_MOVE_2B_MAGNETRISE: 'Magnet Rise',
    GYARADOS_MOVE_1A_DRAGONBREATH: 'Dragon Breath',
    GYARADOS_MOVE_1B_AQUATAIL: 'Aqua Tail',
    GYARADOS_MOVE_2A_WATERFALL: 'Waterfall',
    GYARADOS_MOVE_2B_BOUNCE: 'Bounce',
    MIRAIDON_MOVE_1A_CHARGEBEAM: 'Charge Beam',
    MIRAIDON_MOVE_1B_ELECTRODRIFT: 'Electro Drift',
    MIRAIDON_MOVE_2A_THUNDER: 'Thunder',
    MIRAIDON_MOVE_2B_PARABOLICCHARGE: 'Parabolic Charge',
    FALINKS_MOVE_1A_MEGAHORN: 'Megahorn',
    FALINKS_MOVE_1B_IRONHEAD: 'Iron Head',
    FALINKS_MOVE_2A_NORETREAT: 'No Retreat',
    FALINKS_MOVE_2B_BEATUP: 'Beat Up',
    CERULEDGE_MOVE_1A_BITTERBLADE: 'Bitter Blade',
    CERULEDGE_MOVE_2A_PSYCHOCUT: 'Psycho Cut',
    CERULEDGE_MOVE_1B_PHANTOMFORCE: 'Phantom Force',
    CERULEDGE_MOVE_2B_FLAMECHARGE: 'Flame Charge',
    HOOH_MOVE_1A_FLY: 'Fly',
    HOOH_MOVE_1B_FIRESPIN: 'Fire Spine',
    HOOH_MOVE_2A_FLAMETHROWER: 'Flamethrower',
    HOOH_MOVE_2B_SKYATTACK: 'Sky Attack',

    // Roles
    ATTACKER: 'Attacker',
    DEFENDER: 'Defender',
    ALL_ROUNDER: 'All-Rounder',
    SPEEDSTER: 'Speedster',
    SUPPORTER: 'Supporter',

    //// Attributes
    //// Split into good and bad attributes. Try to mimic the good attributes of known comps and minimize the bad attributes or cancel out the bad attributes.
    // Character-Only Attributes
    CAN_LANE: 'Can Be A Laner',
    CAN_JUNGLE: 'Can Be A Jungler',
    STRONG_EARLY: 'Strong Early Game', // This should change to or maybe be supplemented by what levels they spike
    STRONG_MIDDLE: 'Strong Mid Game',
    STRONG_LATE: 'Strong Late Game',
    MELEE: 'Melee',
    LOW_RANGE: 'Low Range',
    MID_RANGE: 'Mid Range',
    LONG_RANGE: 'Long Range',
    HIGH_MOBILITY: 'Very Mobile',
    MEDIUM_MOBILITY: 'Somewhat Mobile',
    GOOD_SCORING: 'Good Scoring',
    TRUE_DAMAGE: 'True Damage',
    SNOWBALL: 'Snowballs',

    // Jungle Attributes (Character-Only)
    SUSCEPTIBLE_TO_INVADES: 'Susceptible To Invades', // Things like Kubfu that struggle to do their first clear quickly
    SPLITS_JUNGLE: 'Splits Jungle', // Things like eldegoss that like to take red buff and help speed up the jungler's first clear
    FULL_SPLIT_JUNGLE: 'Full Split Jungler', // Things like two eevees that can each take half of the jungle or really anything that spikes at level 4.
    INVADES: 'Likes To Invade',

    // Sub-classes of characters (Put on Moveset. If by moveset it is specified on one set of moves EX: Venusaur Petal Dance = Bruiser while Solarbeam = artillery)
    ADC: 'ADC',
    BRUISER: 'Bruiser',
    BURST_MAGE: 'Burst Mage',
    CONTROL_MAGE: 'Control Mage',
    CLERIC: 'Cleric',
    LOCKDOWN: 'Lockdown', // As in it does a good job of locking down other opponents
    ENGAGE: 'Has Good Engage',
    ASSASSAIN: 'Assassain',
    TANK: 'Tank',
    DRAIN_MAGE: 'Drain Mage',
    ARTILLERY_MAGE: 'Artillery Mage',
    
    // Other Attributes
    PEEL: 'Has Good Peel',
    SELF_PEEL: 'Has Self Peel',
    ENGAGE: 'Has Good Engage',
    DISENGAGE: 'Has Good Disengage',
    POKE: 'Poke Damage',
    GOOD_SUSTAIN: 'Good Sustain',
    GROUP_HEALING: 'Group Healing',
    SINGLE_TARGET_HEALING: 'Single Target Healing',
    USES_SHIELDS: 'Uses Shields',
    GIVES_UNSTOPPABLE: 'Gives Unstoppable',
    HAS_UNSTOPPABLE: 'Has Unstoppable',
    BUFFS: 'Gives Buffs',
    DEBUFFS: 'Applies Debuffs',
    GROUP_CC: 'Group CC',
    SINGLE_CC: 'Single Target CC',
    SOLO_CARRY: 'Solo Carry',
    BURST_DAMAGE: 'Burst Damage',
    TEAMFIGHTER: 'Good Teamfight',
    GOOD_1V1: 'Good Duelist',
    FINDS_PICKS: 'Forces Picks',
    FAST_RIP: 'Fast Rip',
    GOOD_SECURE: 'Good Secure',
    SPACE_CONTROL: 'Controls Space',
    VISION: 'Grants Vision',
    BACKLINE_ACCESS: 'Kills Backline',
}

// Drawbacks:
// Needs support at all times (decid)
// Bad early
// Falls off
// Bad secure
// Squishy
// Bad teamfight
// Bad duelist
// Slow rip
// Only strong for brief windows

module.exports = constants;