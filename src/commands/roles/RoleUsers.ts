import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";
import { isNullOrUndefined } from "util";

export class RoleUsers extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "roleusers",
            group: "roles",
            memberName: "roleusers",
            aliases: ["ru", "rusers", "roleusers"],
            description: "Prints out a list of users assigned to a specific role."
        });
    }

    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | void> {
        let character = RolesManager.getFormattedRoleString(args).trim();

        if (character === undefined || character === "") {
            return msg.reply("Please provide a role as a parameter.");
        }

        let currentRole = msg.guild.roles.find(role => role.name.trim().toLowerCase() === character);

        if (currentRole == undefined)
            return msg.reply ("Please provide a role that actually exists.");

        let listToPrint = "";
        let roleList = currentRole.members;
        let roleListArray = roleList.array();

        for (let x = 0; x < roleList.size; x++) {
            if (roleListArray[x].nickname == null)
                listToPrint += "\n" + roleListArray[x].user.username;
            else
                listToPrint += "\n" + roleListArray[x].nickname;
        }
        msg.reply ("\nMembers with " + currentRole.name + ":\n" + listToPrint);

    }
}
module.exports = RoleUsers;