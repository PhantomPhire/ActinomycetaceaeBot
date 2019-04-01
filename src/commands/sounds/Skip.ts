import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer} from "../../../DiscordBotUtils/";

/**
 * A command to request the bot to skip the next voice track
 */
class Skip extends Command {
    /**
     * Initializes a new instance of the Skip class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "skip",
            group: "sounds",
            memberName: "skip",
            description: "Skip current sound in queue."
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | void> {
        GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id).skip();
    }
}
module.exports = Skip;