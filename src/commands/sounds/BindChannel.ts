import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer, NameResolution} from "discord-shine";

/**
 * A command for binding the bot to a voice channel in a guild
 */
class BindChannel extends Command {
    /**
     * Initializes a new instance of the BindChannel class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "bindchannel",
            group: "sounds",
            memberName: "bindchannel",
            aliases: ["bind"],
            description: "Sets bound voice channel to parameter"
        });
    }

    /**
     * Tests the command for proper permissions.
     * @param msg The message that was posted.
     */
    hasPermission(msg: CommandoMessage): boolean {
        if (msg.guild == undefined) {
            return true;
        }
        return msg.member.hasPermission("ADMINISTRATOR");
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | null> {
        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        let voiceChannel = NameResolution.stringToVoiceChannel(args, msg.guild);

        if (voiceChannel === undefined)
            return msg.say("Error: No valid voice channel found");

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);
        player.boundVoiceChannel = voiceChannel;
        return msg.say("Successfully bound to " + voiceChannel.toString());
    }
}
module.exports = BindChannel;