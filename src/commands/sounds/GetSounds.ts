import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SoundFileManager} from "discord-shine";
import {ActBotConstants} from "../../Constants";
import fs = require("fs");

/**
 * A command to retrieve all available sounds from the bot
 */
class GetSounds extends Command {
    /**
     * Initializes a new instance of the GetSounds class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "getsounds",
            group: "sounds",
            memberName: "getsounds",
            description: "Sends the sounds.txt file in a DM, which "
                + "contains all sound names and groups."
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | null> {
        let soundPath = SoundFileManager.soundPath();
        if (soundPath == undefined) {
            return msg.say("This bot's sound path has not been specified.");
        }

        // Read whole directory for filenames
        let items = fs.readdirSync(soundPath);
        let message: string = "Here is a list of supported sounds:\n";

        for (let i = 0; i < items.length; i++) {
            let temp = items[i].split(".");

            if (message.length + temp[0].length > ActBotConstants.discordMaxMessageLength) {
                msg.say(message);
                message = "";
            }

            message += temp[0] + "\n";
        }

        return msg.say(message);
    }
}
module.exports = GetSounds;