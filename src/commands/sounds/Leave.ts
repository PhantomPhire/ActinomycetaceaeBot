import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer} from "mikes-discord-bot-utils";

/**
 * A command to request the bot to leave a voice channel
 */
class Leave extends Command {
    /**
     * Initializes a new instance of the Leave class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "leave",
            group: "sounds",
            memberName: "leave",
            description: "Forces bot to leave current voice channel"
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);
        player.leave();
        return msg.say("Leaving...");
    }
}
module.exports = Leave;