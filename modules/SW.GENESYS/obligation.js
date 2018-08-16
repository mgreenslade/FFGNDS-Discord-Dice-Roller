const dice = require('../').dice;
const readData = require('../').readData;

async function obligation(bot, message) {
	return new Promise(async resolve => {
		let characterStatus = await readData(bot, message, 'characterStatus');
		let obList = [];
		if (Object.keys(characterStatus).length === 0) {
			message.channel.send("No characters found please use !char to setup");
			return;
		}
		Object.keys(characterStatus).forEach((characterName) => {
			Object.keys(characterStatus[characterName].obligation).forEach((obName) => {
				obList.push({
					name: characterName,
					obligation: obName,
					value: characterStatus[characterName].obligation[obName]
				});
			})
		});
		obList.sort((a, b) => a.value - b.value);
		let roll = dice(100);
		let target = 0;
		let obTotal = 0;
		obList.forEach(ob => obTotal += ob.value);
		message.channel.send("The total group obligation is " + obTotal + ". The obligation roll is " + roll + ".");

		if (roll > obTotal) {
			message.channel.send("No obligation triggered");
			resolve();
		}

		for (let i = 0; i < obList.length; i++) {
			target += obList[i].value;
			if (target > roll) {
				message.channel.send(obList[i].name + "\'s " + obList[i].obligation + " obligation has been triggered.");
				break;
			}
		}
	}).catch(error => message.reply(`That's an Error! ${error}`));

}

exports.obligation = obligation;