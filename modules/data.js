const firebase = require('firebase');

function readData(bot, message, dataSet) {
	return new Promise(resolve => {
		let dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}`);
		if (dataSet === 'prefix') {
			if (message.guild) dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.guild.id}/`);
			else resolve();
		}

		dbRef.once('value').then(snap => {
			let data = snap.val();
			switch (dataSet) {
				case 'prefix':
					resolve(data);
					return;
				case 'diceResult':
					if (data) data = snap.val()[message.author.id];
					break;
				case 'characterStatus':
					if (data) {
						Object.keys(data).forEach((name) => {
							if (!data[name].crit) data[name].crit = [];
							if (!data[name].obligation) data[name].obligation = {};
						})
					}
					break;
				default:
					break;
			}
			if (!data) {
				if (dataSet === 'channelEmoji') resolve('swrpg');
				resolve({});
				return;
			}
			resolve(data);
		}, error => {
			console.error(error);
			message.channel.send(`Error retrieving data`);
			resolve({});
		});
	}).catch(error => message.reply(`That's an Error! ${error} in readData`));
}

function writeData(bot, message, dataSet, data) {
	return new Promise(resolve => {
		let dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}`);
		if (dataSet === 'diceResult') dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}/${message.author.id}`);
		if (dataSet === 'prefix') dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.guild.id}/`);
		dbRef.set(data).then(error => {
			if (error) console.error(error);
			resolve()
		});
	}).catch(error => message.reply(`That's an Error! ${error}`));
}

exports.readData = readData;
exports.writeData = writeData;
