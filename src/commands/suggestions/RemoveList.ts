import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SuggestionsManager} from "../../utility/SuggestionsManager";

/**
 * A command for removeing a list to the list of suggestions.
 */
export class RemoveList extends Command {
    /**
     * Initializes a new instance of the Removesuggestion class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "removelist",
            group: "suggestions",
            memberName: "removelist",
            aliases: ["rl"],
            description: "Removes a list. Note that this command will only work on a list with no suggestions."
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
            let result = SuggestionsManager.removeList(args);
            if (result == SuggestionsManager._resultEnum.LIST_DOES_NOT_EXIST)
                return msg.say("This list does not exist. Use the getlists command to see all existing lists.");
            if (result == SuggestionsManager._resultEnum.LIST_NOT_EMPTY)
                return msg.say ("This list is not empty. Only empty lists can be removed.");
            if (result == SuggestionsManager._resultEnum.LIST_REMOVED)
                return msg.say ("List removed!");
        }
        else
            return msg.say("Provide the name of the list you want to remove.");
        return Promise.resolve(null);
    }
}
module.exports = RemoveList;