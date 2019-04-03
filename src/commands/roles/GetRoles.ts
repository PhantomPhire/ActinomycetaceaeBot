import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";

export class GetRoles extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "getroles",
            group: "roles",
            memberName: "getrole",
            aliases: ["gr", "grole", "getrole"],
            description: "Prints out a list of valid roles that a user can opt in/out of."
        });
    }

    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]>  {
        let roles = RolesManager.roles;
        let rolePrint = "";

        for (let i = 0; i < roles.length; i++) {
            rolePrint += "\n" + roles[i];
        }

        return msg.say("Here is the list of valid roles:" + rolePrint, {});
    }
}
module.exports = GetRoles;