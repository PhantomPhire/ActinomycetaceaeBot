import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer, NameResolution} from "mikes-discord-bot-utils";

/**
 * A command to request the bot to join a voice channel
 */
class Join extends Command {
    /**
     * Initializes a new instance of the Join class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "join",
            group: "sounds",
            memberName: "join",
            description: "Forces bot to join a channel"
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        let voiceChannel = NameResolution.stringToVoiceChannel(args, msg.guild);

        if (voiceChannel === undefined)
            return msg.say("Error: No valid voice channel found");

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);
        player.join(voiceChannel);
        return msg.say("Joining...");
    }
}
module.exports = Join;