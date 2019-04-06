import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";

/**
 * A command to disallow a role from being assinged by users
 */
export class BlockRole extends Command {
    /**
     * Initializes a new instance of the BlockRole class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "blockrole",
            group: "roles",
            memberName: "blockrole",
            aliases: ["br", "brole"],
            description: "Removes an existing role from the list of permitted roles users can opt into/out of."
        });
    }

    /**
     * Tests the command for proper permissions.
     * @param msg The message that was posted.
     */
    public hasPermission(msg: CommandMessage): boolean {
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
    public async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        if (msg.guild == undefined)
            return msg.say("This command can only be executed in a guild.");

        if (args != undefined && args.length > 0) {
            let result = RolesManager.updateRolesFile(args, false);
            if (result)
                return msg.say("Role Blocked!");
            else
                return msg.say("Can't block a roll that hasn't been allowed..");
        }
        else {
            return msg.say("You somehow screwed up dumbass. Bots aren't magic. They can't read your mind. The Role is needed.");
        }
    }
}
module.exports = BlockRole;