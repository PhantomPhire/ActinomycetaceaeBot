import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer} from "../../../DiscordBotUtils/";
import {ActinomycetaceaeDiscord} from "../../ActinomycetaceaeDiscord";

/**
 * A command to set the bot's voice mode
 */
class SetMode extends Command {
    /**
     * Initializes a new instance of the SetMode class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "setmode",
            group: "sounds",
            memberName: "setmode",
            aliases: ["mode"],
            description: "Sets the voice mode"
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
        let value = parseInt(args);
        if (msg.guild == undefined) {
            return msg.say("You can't do that here.");
        }

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);
        if (value === 1)
            player.joinAndPlay = true;
        else if (value === 2)
            player.joinAndPlay = false;
        else
            player.joinAndPlay = !player.joinAndPlay;

        if (player.joinAndPlay)
            return msg.say("Set to join and play mode");
        else
            return msg.say("Set to commanded playback mode");
    }
}
module.exports = SetMode;