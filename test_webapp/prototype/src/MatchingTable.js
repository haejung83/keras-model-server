
export default class MatchingTable {
    millTimes = [];
    expectedResult = [];
    parsedJson = null;

    loadFromFile = (f, onLoadedCallback) => {
        // TODO: Load from json file and build table
        var reader = new FileReader();

        reader.readAsText(f, "UTF-8");
        reader.onloadend = () => {
            console.log(reader.result);
            let parsedMatchingTables = JSON.parse(reader.result);

            if(parsedMatchingTables) {
                parsedMatchingTables.forEach((table) => {
                    this.millTimes.push(table.mills);
                    this.expectedResult.push(table.expected);
                })
                this.parsedJson = parsedMatchingTables;
            }

            if(onLoadedCallback)
                onLoadedCallback();

            console.log("LoadFromFile: " + this.millTimes.length);
        }
    }

    size = () => {
        return (this.millTimes.length === this.expectedResult.length) 
            ? this.millTimes.length : 0;
    }

    getTableByIndex = (index) => {
        if(index < this.millTimes.length) {
            return { mills: this.millTimes[index],
                     expected: this.expectedResult[index] }
        }
        else
            return { mills: 0, expected: "" }
    }

    getJson = () => {
        return this.parsedJson;
    }

}
