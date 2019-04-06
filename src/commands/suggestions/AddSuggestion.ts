import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SuggestionsManager} from "../../utility/SuggestionsManager";

/**
 * A command for adding a suggestion to the list of suggestions.
 */
export class Addsuggestion extends Command {
    /**
     * Initializes a new instance of the Addsuggestion class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "addsuggestion",
            group: "suggestions",
            memberName: "addsuggestion",
            description: "Adds a suggestion and appends it to the file"
            });
    }

    /**
     * Tests the command for proper permissions.
     * @param msg The message that was posted.
     */
    public hasPermission(msg: CommandoMessage): boolean {
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
    public async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | null> {
        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        if (args != undefined && args.length > 0) {
            let result = SuggestionsManager.addsuggestion(args);
            if (result)
                return msg.say("Suggestion added!");
            else
                return msg.say("This was already suggested...Guess others share your weird-ass interests..");
        }
        else {
            return msg.say("You somehow screwed up dumbass");
        }
    }
}
module.exports = Addsuggestion;