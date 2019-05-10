import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SuggestionsManager} from "../../utility/SuggestionsManager";

/**
 * A command for removeing a suggestion to the list of suggestions.
 */
export class RemoveSuggestion extends Command {
    /**
     * Initializes a new instance of the Removesuggestion class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "removesuggestion",
            group: "suggestions",
            memberName: "removesuggestion",
            aliases: ["rs"],
            description: "Removes suggestion from the provided list. Commands should be formatted in LIST/SUGGESTION format. Including the /"
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

        if (args.indexOf("/") == -1)
            return msg.say("Command not formatted correctly. It should be in the LIST/SUGGESTION format. Don't forget the /");

        if (args != undefined && args.length > 0) {
            let result = SuggestionsManager.removeSuggestion(args);
            if (result == SuggestionsManager._resultEnum.LIST_DOES_NOT_EXIST)
                return msg.say("This list does not exist.");
            if (result == SuggestionsManager._resultEnum.SUGGESTION_REMOVED)
                return msg.say("Suggestion removed!");
            if (result == SuggestionsManager._resultEnum.SUGGESTION_DOES_NOT_EXIST)
                return msg.say("This suggestion does not exist in the list provided.");
        }
        else
            return msg.say("You get nothing. Good day, sir.");
        return Promise.resolve(null);
    }
}
module.exports = RemoveSuggestion;