import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";

export class AllowRole extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "allowrole",
            group: "roles",
            memberName: "allowrole",
            aliases: ["ar", "arole"],
            description: "Adds an existing role to the list of permitted roles users can opt into/out of"
        });
    }

    /**
     * Tests the command for proper permissions.
     * @param msg The message that was posted.
     */
    public hasPermission(msg: CommandMessage): boolean {
        if (!msg.guild) {
            return false;
        }
        return msg.member.hasPermission("ADMINISTRATOR");
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    public async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]>  {
        if (args != undefined && args.length > 0) {
            let result = RolesManager.updateRolesFile(args, true);
            if (result)
                return msg.say("Role Allowed!");
            else
                return msg.say("Get your eyes checked. This role has already been allowed.");
        }
        else {
            return msg.say("You somehow screwed up dumbass. Bots aren't magic. They can't read your mind. The Role is needed.");
        }
    }
}
module.exports = AllowRole;