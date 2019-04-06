import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";

/**
 * A command to retrieve the list of allowed roles
 */
export class GetRoles extends Command {
    /**
     * Initializes a new instance of the GetRoles class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "getroles",
            group: "roles",
            memberName: "getrole",
            aliases: ["gr", "grole", "getrole"],
            description: "Prints out a list of valid roles that a user can opt in/out of."
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        let roles = RolesManager.roles;
        let rolePrint = "";

        for (let i = 0; i < roles.length; i++) {
            rolePrint += "\n" + roles[i];
        }

        return msg.say("Here is the list of valid roles:" + rolePrint, {});
    }
}
module.exports = GetRoles;