import {ActBotConstants} from "../Constants";
import fs = require("fs");
import { Collection } from "discord.js";
import { SuggestionLists} from "./SuggestionLists";

/**
 * Enum for potential results
 * @constant
 */
const resultEnum = {LISTEXISTS: 6, SUGGESTIONDOESNOTEXIST: 5, LISTADDED: 4, DERP: 3, SUGGESTIONADDED: 2, LISTDOESNOTEXIST: 1, SUGGESTIONEXISTS: 0};

/**
 * A static repository for holding suggestions for TrollBot
 */
export abstract class SuggestionsManager {
    /**
     * The internal collection of suggestions.
     */
    /*private static _suggestions: Collection<number, string> = new Collection<number, string>();*/

    // private static _suggestions: Array<string> = new Array<string>();
    private static _suggestions: Collection<string, Array<string>> = new Collection<string, Array<string>>();

    /**
     * Initializes the suggestions repository.
     */
    public static initialize() {
       // SuggestionsManager.readsuggestionsFile();
    }

    /**
     * Adds a suggestion to the file and saves the file.
     * @param suggestion The suggestions to add.
     */
    public static addsuggestion(args: string): number | undefined {
        let index = args.indexOf("/");
        let tempList = args.substring(0, index).toLowerCase().trim();
        let tempSuggestion = args.substring(index + 1).toLowerCase().trim();

        if (!SuggestionsManager._suggestions.has(tempList))
            return resultEnum.LISTDOESNOTEXIST;

        let currentSuggestions = SuggestionsManager._suggestions.get(tempList);

        if (currentSuggestions) {
            for (let index = 0; index < currentSuggestions.length; index++) {
                if (currentSuggestions[index] == tempSuggestion) {
                    return resultEnum.SUGGESTIONEXISTS;
                }
            }
            currentSuggestions.push(tempSuggestion);
            SuggestionsManager._suggestions.set(tempList, currentSuggestions);
            this.updateFile();
            return resultEnum.SUGGESTIONADDED;
        }
        else {
            return resultEnum.DERP; // This shouldn't happen..
        }
    }

    public static addList(list: string): number | undefined {
        let tempList = list.toLowerCase().trim();
        if ( SuggestionsManager._suggestions.has(tempList))
            return resultEnum.LISTEXISTS;
        SuggestionsManager._suggestions.set(tempList, new Array<string>());
        return resultEnum.LISTADDED;
    }

    /**
     * Removes a suggestion from the list and updates the file.
     * @param suggestion The suggestion to remove.
     */
    public static removesuggestion(suggestion: string): boolean | undefined {

        return false;
    }

    /**
     * Updates the suggestion file. Used when user removes entry from the list.
     */
    public static updateFile() {
        let toJSON = JSON.stringify(SuggestionsManager._suggestions);
        fs.writeFileSync(ActBotConstants.suggestionsPath, toJSON);
    }

    /**
     * Gets all suggestions in the list.
     */
    public static getsuggestions(list: string): string | undefined {
        let templist = list.toLowerCase().trim();
        if (SuggestionsManager._suggestions.has(templist)) {
            let suggestionsToReturn = SuggestionsManager._suggestions.get(templist);
            if (suggestionsToReturn!.toString() == "")
                return "List is empty. Add a suggestion!";
            console.log(suggestionsToReturn);
            console.log(suggestionsToReturn!.toString());
            let t1 = suggestionsToReturn!.toString();
            let t2 = t1.replace(/,/g, "\n");
            console.log(t2);
            return suggestionsToReturn!.toString().replace(/,/g, "\n");
        }
        return undefined;
    }

    /**
     * Reads in the suggestions file from memory.
     */
    private static readsuggestionsFile() {

        SuggestionsManager._suggestions.clear();
        let tempString = fs.readFileSync(ActBotConstants.suggestionsPath).toString("utf-8");
        let tempParsed = JSON.parse(tempString) as Array<SuggestionLists>;
        tempParsed.forEach(element => {
            if (!SuggestionsManager._suggestions.has(element.ListName.toLowerCase()))
                SuggestionsManager._suggestions.set(element.ListName.toLowerCase(), element.Suggestions);
        });
    }
}
