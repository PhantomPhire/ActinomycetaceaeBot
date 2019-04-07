import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {GuildAudioPlayer} from "discord-shine";

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

        let value = parseInt(args);

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