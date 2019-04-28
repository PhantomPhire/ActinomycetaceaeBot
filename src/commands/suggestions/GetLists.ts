import {GuildMember, Message} from "discord.js";
import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {SuggestionsManager} from "../../utility/SuggestionsManager";
import {NameResolution} from "discord-shine";

/**
 * A command for sending a lists to a member.
 */
export class GetLists extends Command {
    /**
     * Initializes a new instance of the Getsuggestions class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
                name: "getlists",
                group: "suggestions",
                memberName: "getlists",
                description: "Retrieves the names of all lists"
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

        // let member: GuildMember | undefined = NameResolution.stringToGuildMember(args, msg.guild);
        let lists = SuggestionsManager.getlists();
        if (lists !== undefined && lists !== "") {
            return msg.say("Suggestion lists:\n\n" + lists);
        }
        return msg.say("No lists have been created. Use the addlist command to create a new list!");
    }

}
module.exports = GetLists;