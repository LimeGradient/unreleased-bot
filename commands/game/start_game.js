const { SlashCommandBuilder } = require('discord.js');
const {AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource  } = require('@discordjs/voice');

const path = require('node:path')
const fs = require('node:fs')

const songs = []
const songNum = {
    songNum: null,
    get getSongNum() {return this.songNum},
    set setSongNum(num) {this.songNum = num}
}
const player = createAudioPlayer()

function randomizeSong() {
    return Math.floor(Math.random() * 17)
}

function playNextSong() {
    const resource = createAudioResource(path.join(__dirname, `../../music/${songs[songNum.getSongNum]}`))
    player.play(resource)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start_game')
		.setDescription('Start the game'),
	async execute(interaction) {
        songNum.setSongNum = randomizeSong()
        fs.readdir(path.join(__dirname, "../../music"), (err, files) => {
            if (err) throw err;

            files.forEach((file) => {
                songs.push(file)
            })
        })
        player.on(AudioPlayerStatus.Playing, async () => {
            console.log("Audio Player started playing " + songs[songNum.getSongNum])
        })

        player.on('error', error => {
            console.error(`Error: ${error.message} with resource`)
        })

        const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.client.channels.cache.get(interaction.channelId).guild.voiceAdapterCreator,
            selfDeaf: false,
        })
        await interaction.reply(`Starting the game!`)
        const subscription = connection.subscribe(player);

        playNextSong()
	},
    songs,
    songNum,
    randomizeSong,
    player,
    playNextSong,
};