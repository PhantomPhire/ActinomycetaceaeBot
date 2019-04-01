import {ActBotConstants} from "../Constants";
import fs = require("fs");

/**
 * A static repository for holding role names for ActBot
 */
export abstract class RolesManager {
    /**
     * The collection of roles.
     */
    private static _roles: Array<string> = [];

    /**
     * Gets the full list of roles
     */
    public static get roles(): Array<string> {
        // Copies the array to avoid mutation by other classes
        let rolesCopy: string[] = [];
        for (let i = 0; i < RolesManager._roles.length; i++) {
            rolesCopy[i] = RolesManager._roles[i];
        }
        return rolesCopy;
    }

    /**
     * Initializes the roles list.
     */
    public static initialize() {
        this.retrieveRoles();
    }

    /**
     * Gets the roles.json and deserialzes into _roles array
     */
    public static retrieveRoles() {
        RolesManager._roles = require(ActBotConstants.assetPath + "roles.json") as Array<string>;
    }
    /**
     * Adds or removes a role to _roles array, serializes to json, and updates json file
     * @param role The roles to add.
     * @param add Determines whether adding or removing a role from list
     */
    public static updateRolesFile(role: string, add: boolean): boolean | undefined {
        if (role == undefined || role == "") {
            throw new Error("Role is blank or undefined..something went horribly wrong");
        }
        if (add) {
            let indexOfRole = RolesManager._roles.findIndex(x => x == role);
            if (indexOfRole >= 0) {
                return false;
            }
            RolesManager._roles.push(role);
        }
        else {
            let indexOfRole = RolesManager._roles.findIndex(x => x == role);
            if (indexOfRole < 0 || indexOfRole == undefined) {
                return false;
            }
            RolesManager._roles.splice(indexOfRole, 1);
        }
        let tempJSON = JSON.stringify(RolesManager._roles);
        fs.writeFileSync(ActBotConstants.rolesPath, tempJSON);
        return true;
    }
    /**
     * Validates that a string matches up with a role on the role list.
     * @param potentialRole The name to test as a role.
     */
    public static validateRole(potentialRole: string): boolean {
        return (RolesManager._roles.find( (name: string) => name.toLowerCase() === potentialRole.toLowerCase() ) !== undefined);
    }

    /**
     * Formats input to match up with a min string
     * @param input The input to format.
     */
    public static getFormattedRoleString(input: string): string {
        return input.toLowerCase().replace(/\./g, "");
    }
}
