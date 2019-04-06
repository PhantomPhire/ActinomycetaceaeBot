import {Command, CommandoClient, CommandMessage} from "discord.js-commando";
import {GuildMember, Message, Role} from "discord.js";
import {RolesManager} from "../../utility/RolesManager";
import {ActinomycetaceaeDiscord} from "../../ActinomycetaceaeDiscord";

/**
 * A command to allow users to set allowed roles for themselves
 */
export class SetRole extends Command {
    /**
     * Initializes a new instance of the SetRole class
     * @param client The commando client to utilize.
     */
    constructor(client: CommandoClient) {
        super(client, {
            name: "setrole",
            group: "roles",
            memberName: "setrole",
            aliases: ["sr", "srole"],
            description: "Allows you to opt in/out of a role. To get a list of roles, "
                + "use the \"getroles\" command"
        });
    }

    /**
     * Runs the command.
     * @param msg The command message.
     * @param args The command arguments.
     * @param fromPattern Whether or not the command is being run from a pattern match.
     */
    async run(msg: CommandMessage, args: string, fromPattern: boolean): Promise<Message | Message[]> {
        let character = RolesManager.getFormattedRoleString(args).trim();

        if (character === undefined || character === "") {
            return msg.reply("please provide a role as a parameter.");
        }

        if (!RolesManager.validateRole(character)) {
            return msg.reply(character + " is not a valid role... Maybe you should get the list of available roles first?");
        }

        let guild = undefined;

        if (msg.guild == null) {
            guild = ActinomycetaceaeDiscord.getGuild();
        }
        else {
            guild = msg.guild;
        }

        let possibleRoles = guild!.roles.filterArray( (r: Role) => (RolesManager.getFormattedRoleString(r.name) === character && RolesManager.validateRole(r.name)));

        if (possibleRoles.length < 1)
            possibleRoles = guild!.roles.filterArray( (r: Role) => (RolesManager.getFormattedRoleString(r.name).includes(character) && RolesManager.validateRole(r.name)));

        if (possibleRoles.length > 1) {
            return msg.say("Ambiguous input. Ain't that some shit?");
        }

        let roleToSet = possibleRoles[0];
        guild!.fetchMember(msg.author)
        .then((member) => {
            try {
                let redundantRole = member.roles.get(roleToSet.id);
                if (redundantRole === undefined) {
                    member.addRole(roleToSet.id)
                    .then((member: GuildMember) => msg.reply("you're now a part of: " + roleToSet.name + ".").catch(console.error));
                }
                else {
                    member.removeRole(redundantRole)
                    .then((member: GuildMember) => msg.reply("you are no longer a part of: " + roleToSet.name + ".").catch(console.error))
                    .catch(console.error);
                }
            }
            catch (err) {
                console.log(err);
                msg.reply("Someone dun fucked up. The role: " + args + " was allowed but does not exist..\nShame on you.");
            }
        });

        // So this is completely pointless but the typescript definitions of this function absolutely demand a promise of a message to be returned at the
        // end of every command function soooo.....¯\_(ツ)_/¯
        return msg.clearReactions();
    }
}
module.exports = SetRole;