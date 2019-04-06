import * as config from "../../config.json";
import {CommandoClient} from "discord.js-commando";
import {BotManager, GuildAudioPlayer, SoundFileManager} from "mikes-discord-bot-utils";

/**
 * A wrapper for the TrollBot, managing its events and internals
 */
export class ActinomycetacaeBotManager extends BotManager {
    /**
     * Initializes a new instance of the ActinomycetacaeBotManager.
     */
    constructor() {
        super(new CommandoClient({ commandPrefix: (<any>config).prefix, owner: (<any>config).owner }));
        let soundConfig = (<any>config).soundPath as string | undefined;
        if (soundConfig !== undefined) {
            SoundFileManager.initialize((<any>config).soundPath);
        }
    }

    /**
     * Executes the running for the bot.
     */
    public run() {
        super.run((<any>config).token);

        this.setupEventListeners();

        // Read in commands
        this._bot.registry.registerGroup("sounds", "Sounds");
        this._bot.registry.registerGroup("misc", "Misc");
        this._bot.registry.registerGroup("suggestions", "Suggestions");
        this._bot.registry.registerGroup("roles", "Roles");
        this._bot.registry.registerDefaults();
        this._bot.registry.registerCommandsIn(__dirname + "/commands");
    }

    /**
     * Sets up the bot's event listeners.
     */
    private setupEventListeners() {
        // Add function for when bot is ready
        this._bot.on("ready", () => {
            this._bot.user.setActivity("AAAAAHHHHHHHHHHHHH!!!!!!!!!");
            GuildAudioPlayer.loadPersistentGuilds();
        });
    }
}