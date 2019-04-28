import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
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
    async run(msg: CommandoMessage, args: string, fromPattern: boolean): Promise<Message | Message[] | null> {
        let character = RolesManager.getFormattedRoleString(args).trim();

        if (character === undefined || character === "") {
            return msg.reply("please provide a role as a parameter.");
        }

        if (!RolesManager.validateRole(character)) {
            return msg.reply(character + " is not an allowed role. Use the !getroles command to see which roles are allowed.");
        }

        let guild = undefined;

        if (msg.guild == null) {
            guild = ActinomycetaceaeDiscord.getGuild();
        }
        else {
            guild = msg.guild;
        }

        if (guild == undefined) {
            return msg.say("Can't do that in a DM when you are not part of the Actinomycetaceae guild");
        }

        let possibleRoles = guild.roles.filter( (r: Role) => (RolesManager.getFormattedRoleString(r.name) === character && RolesManager.validateRole(r.name)));

        if (possibleRoles.size < 1)
            possibleRoles = guild.roles.filter( (r: Role) => (RolesManager.getFormattedRoleString(r.name).includes(character) && RolesManager.validateRole(r.name)));

        if (possibleRoles.size > 1) {
            return msg.say("Ambiguous input. Ain't that some shit?");
        }

        let roleToSet = possibleRoles.random();

        if (roleToSet != null && guild.members.has(msg.author.id)) {
            let member = guild.members.get(msg.author.id);
            try {
                let redundantRole = member!.roles.get(roleToSet!.id);
                if (redundantRole === undefined) {
                    member!.roles.add(roleToSet!.id)
                    .then((member: GuildMember) => msg.reply("you're now a part of: " + roleToSet!.name + ".").catch(console.error));
                }
                else {
                    member!.roles.remove(redundantRole)
                    .then((member: GuildMember) => msg.reply("you are no longer a part of: " + roleToSet!.name + ".").catch(console.error))
                    .catch(console.error);
                }
            }
            catch (err) {
                console.log(err);
                msg.reply("Someone dun fucked up. The role: " + args + " was allowed but does not exist..\nShame on you.");
            }
        }

        // So this is completely pointless but the typescript definitions of this function absolutely demand a promise of a message to be returned at the
        // end of every command function because TS won't accept null for undefined like the definition says soooo.....¯\_(ツ)_/¯ LOL
        return msg.say("Working on it...");
    }
}
module.exports = SetRole;