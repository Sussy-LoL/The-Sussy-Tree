addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "声望点数", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 22))
        if (hasUpgrade('p', 31)) mult = mult.add(new Decimal(2).times(upgradeEffect('p', 12)).times(upgradeEffect('p', 13)).times(upgradeEffect('p', 21)).times(upgradeEffect('p', 22)).pow(0.2))
        if (player.s.unlocked) mult = mult.times(player.s.points.add(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasUpgrade('p', 32)) exp = new Decimal(1.05)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11:{
            title: "更多点数",
            description: "双倍产出。",
            cost: new Decimal(1),
        },
        12:{
            title: "超多点数",
            description: "根据声望点数提升点数。",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect        
        },
        13:{
            title: "更多声望点数",
            description: "根据点数提升声望点数。",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect        
        },
        21:{
            title: "自我增幅",
            description: "根据点数提升点数。",
            cost: new Decimal(7),
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect        
        },
        22:{
            title: "自我增幅 2.0",
            description: "根据声望点数提升声望点数。",
            cost: new Decimal(20),
            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect        
        },
        23:{
            title: "再乘一遍",
            description: "将第1~5升级的乘数提升点数。",
            cost: new Decimal(100),
        },
        31:{
            title: "再乘一遍 2.0",
            description: "将第1~5升级的乘数提升声望点数。",
            cost: new Decimal(150),
        },
        32:{
            title: "指数!",
            description: "提升点数。",
            cost: new Decimal(2000),
        },
        33:{
            title: "受疑层级",
            description: "解锁嫌疑层",
            cost: new Decimal(10000),
        },
    },
    hotkeys: [
        {key: "p", description: "P: 声望重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
addLayer("s", {
    name: "sus", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "red",
    requires: new Decimal(500), // Can be a function that takes requirement increases into account
    resource: "嫌疑点数", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return ('给予声望点数'+format(player.s.points.add(1))+'x加成')
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches:["p"],
    upgrades: {
    },
    hotkeys: [
        {key: "s", description: "S: 嫌疑望置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a',23)}
})
addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "cyan",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "游戏开始",
            done() { return player.points.gte(10) },
            tooltip: "开始游戏。",
        },
        12: {
            name: "点数的终结",
            done() { return player.p.points.gte(1) },
            tooltip: "声望重置。",
        },
        13: {
            name: "第一个升级",
            done() { return player.p.upgrades.length>=1 },
            tooltip: "买一个升级。",
        },
        14: {
            name: "好起来了",
            done() { return player.p.upgrades.length>=3 },
            tooltip: "买三个升级。",
        },
        15: {
            name: "666",
            done() { return player.p.upgrades.length>=6 },
            tooltip: "买六个升级。",
        },
        21: {
            name: "也许你一辈子也挣不了这么多",
            done() { return player.points.gte(1e6) },
            tooltip: "得到100万点数。",
        },
        22: {
            name: "你真的一辈子也挣不了这么多",
            done() { return player.points.gte(1e12) },
            tooltip: "得到1万亿点数。",
        },
        23: {
            name: "你很sus",
            done() { return hasUpgrade('p',33) },
            tooltip: "解锁嫌疑层。",
        },
    },
    tabFormat: [
        "blank", 
        ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
        "blank", "blank",
        "achievements",
    ],
}, 
)
