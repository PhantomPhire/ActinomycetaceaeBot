import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {SuggestionsManager} from "../../utility/SuggestionsManager";

/**
 * Enum for potential results
 * @constant
 */
const resultEnum = {LISTEXISTS: 6, SUGGESTIONDOESNOTEXIST: 5, LISTADDED: 4, DERP: 3, SUGGESTIONADDED: 2, LISTDOESNOTEXIST: 1, SUGGESTIONEXISTS: 0};

/**
 * A command for adding a new list that holds suggestions.
 */
export class AddList extends Command {
    /**
     * Initializes a new instance of the AddList class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "addlist",
            group: "suggestions",
            memberName: "addlist",
            description: "Creates a new suggestions list."
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
            let result = SuggestionsManager.addList(args);
            switch (result) {
                case resultEnum.LISTADDED:
                    return msg.say("List added!");
                case resultEnum.LISTEXISTS:
                    return msg.say("This list already exists!");
                case resultEnum.SUGGESTIONEXISTS:
                    return msg.say("The suggestion already exists. Use the getsuggestions command to view a list of all suggestion in a list");
                case resultEnum.DERP:
                    return msg.say("Oh no.. you really shouldn't be getting this.. Let a botdev know plz");
            }
        }
        else
            return msg.say("Please provide the name of the list you wish to add.");
        return Promise.resolve(null);
    }
}
module.exports = AddList;