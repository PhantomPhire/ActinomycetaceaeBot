/**
 * Represents a static repository for constants in the application.
 */
export abstract class ActBotConstants {
    /**
     * The path to the root of the application.
     * @constant
     */
    public static readonly rootPath: string = __dirname + "/../../";

    /**
     * The guild Id of the Oklhoma Melee Discord.
     * @constant
     */
    public static readonly actinomycetaceaeDiscordId: string = "181991219813941248";

    /**
     * The path to the suggestions text file.
     * @constant
     */
    public static readonly suggestionsPath: string = ActBotConstants.rootPath + "suggestions.txt";

    /**
     * The maximum message length in Discord.
     * @constant
     */
    public static readonly discordMaxMessageLength = 2000;
}