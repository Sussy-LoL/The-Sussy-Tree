let modInfo = {
	name: "嫌疑树",
	id: "Sussymod",
	author: "SussyLOL",
	pointsName: "点数",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.1",
	name: "嫌疑层",
}

let changelog = `<h1>更新公告:</h1><br>
	<h3>v0.2.2</h3><br>
		- 增加嫌疑层升级。<br>
		- 中文化。`

let winText = `恭喜!你达到了结局并通关了游戏!但现在...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function addAchievement(layer,id) {
	player[layer].achievements.push(id);doPopup("achievement", tmp[layer].achievements[id].name, "成就达成!", 3, tmp[layer].color);
}

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.times(2)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 21)) gain = gain.times(upgradeEffect('p', 21))
	if (hasUpgrade('p', 23)) gain = gain.add(new Decimal(2).times(upgradeEffect('p', 12)).times(upgradeEffect('p', 13)).times(upgradeEffect('p', 21)).times(upgradeEffect('p', 22)).pow(0.2))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}