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
            aliases: ["as"],
            description: "Adds a suggestion and appends it to the provided list. Commands should be formatted in LIST/SUGGESTION format. Including the /"
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
            let result = SuggestionsManager.addSuggestion(args);
            switch (result) {
                case SuggestionsManager._resultEnum.SUGGESTION_ADDED:
                    return msg.say("Suggestion added!");
                case SuggestionsManager._resultEnum.LIST_DOES_NOT_EXIST:
                    return msg.say("The list you provided doesn't exist. If you need to add a new list, use the addList command.");
                case SuggestionsManager._resultEnum.SUGGESTION_EXISTS:
                    return msg.say("The suggestion already exists. Use the getsuggestions command to view a list of all suggestion in a list");
                case SuggestionsManager._resultEnum.DERP:
                    return msg.say("Oh no.. you really shouldn't be getting this...PROBLEM. Let a botdev know plz");
            }
        }
        else
            return msg.say("You get nothing. Good day, sir.");
        return Promise.resolve(null);
    }
}
module.exports = Addsuggestion;