import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer} from "../../../DiscordBotUtils/";

/**
 * A command to request the bot to post its current play list
 */
class Playlist extends Command {
    /**
     * Initializes a new instance of the Playlist class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "playlist",
            group: "sounds",
            memberName: "playlist",
            description: "Displays the current playlist."
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
        return msg.say(player.getQueueListing());
    }
}
module.exports = Playlist;