import {ActinomycetacaeBotManager} from "./ActinomycetacaeBotManager";

setup();

/**
 * Sets up bot functionality.
 */
function setup() {
    const botManager = new ActinomycetacaeBotManager();
    botManager.run();
}
