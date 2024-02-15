const { SlashCommandBuilder } = require('discord.js');

const game = require("./start_game")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answer what song it is")
    .addStringOption(option => 
        option.setName("answer")
        .setDescription("Song Name")
        .setRequired(true)),
    
    async execute(interaction) {
        const tokenizedAnswer = interaction.options.getString("answer").split(" ")
        let song = game.songs[game.songNum.getSongNum]
        console.log(game.songs)
        console.log(game.songNum.getSongNum)
        song = song.replace(/[^\w\s]/gi, '')
        song = song.replace(/[0-9]/g, '')
        song = song.slice(0, -2)
        song = song.toLowerCase()
        console.log(song)
        const containsAllTokens = tokenizedAnswer.every((substr) => {
            return song.indexOf(substr) >= 0;
        })
        if (containsAllTokens) {
            await interaction.reply("Guessed Right")
            game.songNum.setSongNum = game.randomizeSong()
            if (game.songNum.getSongNum == 16) {
                game.songNum.setSongNum = game.randomizeSong()
            }
            game.playNextSong()
        } else {
            await interaction.reply("Guessed Wrong")
        }
    }
}