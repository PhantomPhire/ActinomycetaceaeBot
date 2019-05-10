import {ActBotConstants} from "../Constants";
import fs = require("fs");
import { Collection } from "discord.js";
import { SuggestionLists} from "./SuggestionLists";

/**
 * A static repository for holding suggestions for TrollBot
 */
export abstract class SuggestionsManager {
    /**
     * Enum for potential results.
     */
    public static _resultEnum = {
        SUGGESTION_EXISTS: 1,
        SUGGESTION_ADDED: 2,
        SUGGESTION_DOES_NOT_EXIST: 3,
        SUGGESTION_REMOVED: 4,
        LIST_EXISTS: 5,
        LIST_ADDED: 6,
        LIST_DOES_NOT_EXIST: 7,
        LIST_REMOVED: 8,
        LIST_NOT_EMPTY: 9,
        DERP: 10,
    };

    /**
     * The internal collection of suggestion lists.
     */
    private static _suggestions: Collection<string, Array<string>> = new Collection<string, Array<string>>();

    /**
     * Initializes the suggestions repository.
     */
    public static initialize() {
       this.readSuggestionsFile();
    }

    /**
     * Adds a suggestion to the file and saves the file.
     * @param suggestion The suggestions to add.
     */
    public static addSuggestion(args: string): number | undefined {
        let index = args.indexOf("/");
        let tempList = args.substring(0, index).toLowerCase().trim();
        let tempSuggestion = args.substring(index + 1).toLowerCase().trim();

        if (!this._suggestions.has(tempList))
            return this._resultEnum.LIST_DOES_NOT_EXIST;

        let currentSuggestions = this._suggestions.get(tempList);

        if (currentSuggestions) {
            for (let index = 0; index < currentSuggestions.length; index++) {
                if (currentSuggestions[index] == tempSuggestion) {
                    return this._resultEnum.SUGGESTION_EXISTS;
                }
            }
            currentSuggestions.push(tempSuggestion);
            this._suggestions.set(tempList, currentSuggestions);
            this.updateFile();
            return this._resultEnum.SUGGESTION_ADDED;
        }
        else {
            return this._resultEnum.DERP; // This shouldn't happen..
        }
    }

    public static addList(list: string): number | undefined {
        let tempList = list.toLowerCase().trim();
        if ( this._suggestions.has(tempList))
            return this._resultEnum.LIST_EXISTS;
        this._suggestions.set(tempList, new Array<string>());
        this.updateFile();
        return this._resultEnum.LIST_ADDED;
    }

    /**
     * Removes a suggestion from the list and updates the file.
     * @param suggestion The suggestion to remove.
     */
    public static removeSuggestion(args: string): number | undefined {
        let index = args.indexOf("/");
        let tempList = args.substring(0, index).toLowerCase().trim();
        let tempSuggestion = args.substring(index + 1).toLowerCase().trim();

        if (!this._suggestions.has(tempList))
            return this._resultEnum.LIST_DOES_NOT_EXIST;

        let currentSuggestions = this._suggestions.get(tempList);

        if (currentSuggestions) {
            for (let index = 0; index < currentSuggestions.length; index++) {
                if (currentSuggestions[index] == tempSuggestion) {
                    currentSuggestions.splice(index, 1);
                    this._suggestions.set(tempList, currentSuggestions);
                    this.updateFile();
                    return this._resultEnum.SUGGESTION_REMOVED;
                }
            }
            return this._resultEnum.SUGGESTION_DOES_NOT_EXIST;
        }
        else {
            return this._resultEnum.DERP; // This shouldn't happen..
        }
    }

    /**
     * Removes an empty list.
     * @param args The list to remove.
     */
    public static removeList(args: string): number | undefined {
        if (!this._suggestions.has(args.toLowerCase().trim()))
            return this._resultEnum.LIST_DOES_NOT_EXIST;
        let suggestionCheck = this.getSuggestions(args);
        if (suggestionCheck !== "List is empty. Add a suggestion!")
            return this._resultEnum.LIST_NOT_EMPTY;
        this._suggestions.delete(args);
        this.updateFile();
        return this._resultEnum.LIST_REMOVED;
    }

    /**
     * Updates the suggestion file. Used when user removes entry from the list.
     */
    public static updateFile() {
        let objToStringify = this.collectionToObject();
        let toJSON = JSON.stringify(objToStringify);
        fs.writeFileSync(ActBotConstants.suggestionsPath, toJSON);
    }

    /**
     * Converts the collection of list/suggestions into an object for strigifying.
     */
    public static collectionToObject() {
        let obj = Object.create(null);
        for (let [k, v] of this._suggestions) {
            obj[k] = v;
        }
        return obj;
    }

    /**
     * Gets all suggestions in the list.
     */
    public static getSuggestions(list: string): string | undefined {
        let templist = list.toLowerCase().trim();
        if (this._suggestions.has(templist)) {
            let suggestionsToReturn = this._suggestions.get(templist);
            if (suggestionsToReturn!.toString() == "")
                return "List is empty. Add a suggestion!";
            return suggestionsToReturn!.toString().replace(/,/g, "\n");
        }
        return undefined;
    }

    /**
     * Gets all lists.
     */
    public static getLists(): string | undefined {
        let tempLists = this._suggestions.keyArray();
        return tempLists.toString().replace(/,/g, "\n");
    }

    /**
     * Reads in the suggestions file from .JSON.
     */
    private static readSuggestionsFile() {
        this._suggestions.clear();
        let tempString = fs.readFileSync(ActBotConstants.suggestionsPath).toString("utf-8");
        let tempParsed = JSON.parse(tempString) as Array<SuggestionLists>;
        for (let property in tempParsed) {
            if (!this._suggestions.has(property.toLowerCase()))
                this._suggestions.set(property.toLowerCase(), tempParsed[property]);
        }
    }
}