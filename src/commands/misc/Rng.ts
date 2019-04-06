import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";

/**
 * Gets a random number from the bot
 */
class Rng extends Command {
    /**
     * Initializes a new instance of the Rng class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "rng",
            group: "misc",
            memberName: "rng",
            description: "Returns a random number.\n"
                + "    0 Parameters: Returns a number between 0 and 100\n"
                + "    1 Parameter: Returns a number between 0 and the number specified\n"
                + "    2 Parameters: Returns a number between the two numbers specified\n"
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | null> {
        let userArgs = args.split(" ");
        let bound1, bound2, temp;

        try {
            if (userArgs[1] == undefined || userArgs[1] == "") {
                bound1 = 0;
            }
            else {
                bound1 = parseInt(userArgs[1], 10);
            }

            if (userArgs[0] == undefined || userArgs[0] == "") {
                bound2 = 100;
            }
            else {
                bound2 = parseInt(userArgs[0], 10);
            }

            if (bound1 > bound2) {
                temp = bound1;
                bound1 = bound2;
                bound2 = temp;
            }

            let randomNumber = Math.random() * (bound2 - bound1) + bound1;
            return msg.say(randomNumber);
        }
        catch (err) {
            console.log(err);
            return msg.say("Please format your arguments as numbers.");
        }
    }
}
module.exports = Rng;