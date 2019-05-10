/**
 * A "stringify" able struct for the bot's suggestion lists
 */
export class SuggestionLists {
    /**
     * Array holding suggestions for a specific list.
     */
    public Suggestions: Array<string>;

    /**
     * The name of the list.
     */
    public ListName: string;

    /**
     * Constructs a new instance of the RoastsSaveState class
     * @param listName The name of the list
     * @param suggestions The array of suggestions
     */
    constructor(listName: string, suggestions: Array<string>) {
        this.Suggestions = suggestions;
        this.ListName = listName;
    }
}