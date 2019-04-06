import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {FileSound, GuildAudioPlayer, NameResolution, SoundFileManager} from "mikes-discord-bot-utils";

/**
 * A command to request the bot to play a sound in a voice channel
 */
class PlaySound extends Command {
    /**
     * Initializes a new instance of the PlaySound class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "playsound",
            group: "sounds",
            memberName: "playsound",
            aliases: ["ps"],
            description: "Plays a sound. First parameter is the sound to play. Second parameter is "
                + "the user to follow or the channel to join. By default, the second paremeter is the user "
                + " that issued the command and the first is random sound. Replace spaces with %."
        });
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

        let sound: FileSound | undefined = undefined;
        let userArgs: string[] | undefined = NameResolution.parseArgsIntoArray(args);

        if (userArgs != undefined) {
            for (let i = 0; i < userArgs.length; i++) {
                sound = SoundFileManager.getFileSound(userArgs[i]);
                if (sound != undefined)
                    break;
            }
        }

        if (sound == undefined) {
            sound = SoundFileManager.getRandomFileSound();
            if (sound == undefined) {
                return msg.say("Could not find the sound you were looking for...or any sound for that matter");
            }
        }

        let player = GuildAudioPlayer.getGuildAudioPlayer(msg.guild.id);

        if (player.joinAndPlay) {
            let voiceChannel = NameResolution.commandMessageToVoiceChannel(userArgs, msg, msg.guild);

            if (voiceChannel == undefined)
                return msg.say("Error: Voice channel is not joinable or could not find valid voice channel based on arguments."
                                + " Please be in a voice channel, mention someone in a voice channel, or type the username of someone in a voice channel.");
            player.boundVoiceChannel = voiceChannel;
        }

        player.add(sound!);

        return Promise.resolve(null);
    }
}
module.exports = PlaySound;