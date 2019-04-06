import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SoundFileManager} from "mikes-discord-bot-utils";
import {ActinomycetaceaeDiscord} from "../../ActinomycetaceaeDiscord";
import https = require("https");
import fs = require("fs");

/**
 * A command for adding a sound to file system
 */
class AddSound extends Command {
    /**
     * Initializes a new instance of the Addsound class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "addsound",
            group: "sounds",
            memberName: "addsound",
            description: "Adds a sound. Must be sent as an attachment. Issue command as comment."
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
        let attachments = msg.attachments.array();
        if (attachments[0] == undefined) {
            return msg.say("Attach a file to use this command.");

        }

        let soundPath = SoundFileManager.soundPath();
        if (soundPath == undefined) {
            return msg.say("This bot's sound path has not been specified.");
        }

        let response: string = "";
        let temp;
        for (let i = 0; i < attachments.length; i++) {
            temp = attachments[i].url.split(".");

            if (SoundFileManager.fileIsSupported(temp[temp.length - 1])) {
                let file = fs.createWriteStream(soundPath + attachments[i].filename);
                https.get(attachments[i].url, function(response: NodeJS.ReadableStream) {
                    response.pipe(file);
                    setTimeout(function() {
                        file.end();
                        console.log("Filestream closed");
                    },         30000);
                });
                response = attachments[i].filename + " added.";
            }
            else {
                response = attachments[i].filename + ": File type not supported";
            }
        }

        SoundFileManager.refresh();
        return msg.say(response);
    }
}
module.exports = AddSound;

