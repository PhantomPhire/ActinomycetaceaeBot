import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message, TextChannel} from "discord.js";
import {GuildAudioPlayer} from "../../../DiscordBotUtils/";
import {ActinomycetaceaeDiscord} from "../../ActinomycetaceaeDiscord";

/**
 * A command to set the bot's voice channel feedback channel
 */
class SetFeedback extends Command {
    /**
     * Initializes a new instance of the SetFeedback class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "setfeedback",
            group: "sounds",
            memberName: "setfeedback",
            aliases: ["feedback"],
            description: "Sets the current channel for bot sound feedback"
        });
    }

    /**
     * Tests the command for proper permissions.
     * @param msg The message that was posted.
     */
    hasPermission(msg: CommandMessage): boolean {
        let guild = ActinomycetaceaeDiscord.getGuild();
        if (guild != undefined &&
            guild.members.has(msg.author.id) &&
            guild.members.get(msg.author.id)!.hasPermission("ADMINISTRATOR")) {
            return true;
        }

        return false;
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        if (msg.guild == undefined || (msg.channel as TextChannel) == undefined) {
            msg.say("You can't do that here.");
        }

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);
        player.feedbackChannel = msg.channel as TextChannel;
        return msg.say(msg.channel + " set as new voice feedback channel");
    }
}
module.exports = SetFeedback;