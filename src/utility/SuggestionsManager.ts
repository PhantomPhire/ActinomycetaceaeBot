import {ActBotConstants} from "../Constants";
import fs = require("fs");
import { Collection } from "discord.js";
import { SuggestionLists} from "./SuggestionLists";

/**
 * Enum for potential results
 * @constant
 */
const resultEnum = {LISTNOTEMPTY: 9, LISTREMOVED: 8, SUGGESTIONREMOVED: 7, LISTEXISTS: 6, SUGGESTIONDOESNOTEXIST: 5, LISTADDED: 4, DERP: 3, SUGGESTIONADDED: 2, LISTDOESNOTEXIST: 1, SUGGESTIONEXISTS: 0};

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
    private static _suggestions2: Object = { string: Array<string>()};

    /**
     * Initializes the suggestions repository.
     */
    public static initialize() {
       SuggestionsManager.readsuggestionsFile();
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
        this.updateFile();
        return resultEnum.LISTADDED;
    }

    /**
     * Removes a suggestion from the list and updates the file.
     * @param suggestion The suggestion to remove.
     */
    public static removesuggestion(args: string): number | undefined {
        let index = args.indexOf("/");
        let tempList = args.substring(0, index).toLowerCase().trim();
        let tempSuggestion = args.substring(index + 1).toLowerCase().trim();

        if (!SuggestionsManager._suggestions.has(tempList))
            return resultEnum.LISTDOESNOTEXIST;

        let currentSuggestions = SuggestionsManager._suggestions.get(tempList);

        if (currentSuggestions) {
            for (let index = 0; index < currentSuggestions.length; index++) {
                if (currentSuggestions[index] == tempSuggestion) {
                    currentSuggestions.splice(index, 1);
                    SuggestionsManager._suggestions.set(tempList, currentSuggestions);
                    this.updateFile();
                    return resultEnum.SUGGESTIONREMOVED;
                }
            }
            return resultEnum.SUGGESTIONDOESNOTEXIST;
        }
        else {
            return resultEnum.DERP; // This shouldn't happen..
        }
    }

    /**
     * Removes an empty list.
     * @param args The list to remove.
     */
    public static removelist(args: string): number | undefined {
        if (!SuggestionsManager._suggestions.has(args.toLowerCase().trim()))
            return resultEnum.LISTDOESNOTEXIST;
        let suggestionCheck = SuggestionsManager.getsuggestions(args);
        if (suggestionCheck !== "List is empty. Add a suggestion!")
            return resultEnum.LISTNOTEMPTY;
        SuggestionsManager._suggestions.delete(args);
        this.updateFile();
        return resultEnum.LISTREMOVED;
    }

    /**
     * Updates the suggestion file. Used when user removes entry from the list.
     */
    public static updateFile() {
        let objToStringify = SuggestionsManager.collectionToObject();
        let toJSON = JSON.stringify(objToStringify);
        fs.writeFileSync(ActBotConstants.suggestionsPath, toJSON);
    }

    /**
     * Converts the collection of list/suggestions into an object for strigifying.
     */
    public static collectionToObject() {
        let obj = Object.create(null);
        for (let [k, v] of SuggestionsManager._suggestions) {
            obj[k] = v;
        }
        let temp = JSON.stringify(obj);
        // console.log(temp);
        return obj;
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
            return suggestionsToReturn!.toString().replace(/,/g, "\n");
        }
        return undefined;
    }

    /**
     * Gets all lists.
     */
    public static getlists(): string | undefined {
        let tempLists = SuggestionsManager._suggestions.keyArray();
        // console.log(tempLists.toString()).replace(/,/g, "\n");
        return tempLists.toString().replace(/,/g, "\n");
    }

    /**
     * Reads in the suggestions file from memory.
     */
    private static readsuggestionsFile() {

        SuggestionsManager._suggestions.clear();
        let tempString = fs.readFileSync(ActBotConstants.suggestionsPath).toString("utf-8");
        let tempParsed = JSON.parse(tempString) as Array<SuggestionLists>;

        for (let property in tempParsed) {
            // console.log(property);
            // console.log(tempParsed[property]);
            if (!SuggestionsManager._suggestions.has(property.toLowerCase()))
                SuggestionsManager._suggestions.set(property.toLowerCase(), tempParsed[property]);
        }
        let x = SuggestionsManager.collectionToObject();
        console.log(x);
    }
}
