import fs from 'fs';
import tsv from 'tsv';
import score from 'string-score';

let parsedData = {};
export default class SuggestionController {
    static async suggestion( req, res ) {
         // Read in TSV and parse data
        fs.readFile("./data/cities_canada-usa.tsv", "utf8", (error, data) => {
            parsedData = tsv.parse(data);
        });
// console.log(parsedData, 'am the parsed')
        // Get the string score
        let getScore = (data, term) => {
            var suggestions = [];

            // Create and push new object with score
            data.map(city => {
                suggestions.push ({
                    name: city.name,
                    latitude: city.lat,
                    longitude: city.long,
                    score: score(city.name, term)
                });
            });

            // Sort in descending order
            suggestions.sort((a,b) => {
                return b.score - a.score;
            });

            return suggestions;
        }
        try {
            const q   = req.query.q.trim();
            console.log(q, 'input')
            if ( q.length > 0) {

                const filteredCities = parsedData.filter(city => {
                   return ((city.population > 5000) && ((city.name.toLowerCase().includes(q) || city.alt_name.toLowerCase().split(",").includes(q))))
                });

                // console.log(filteredCities, 'am the new king')
                const data = getScore(filteredCities, q)
                return res.status(200).json({
                    status: 'successful',
                    data: data
                  });
                // send(getScore(filteredCities, searchTerm));
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'Invalid search term'
                  });
                // send("Invalid search term");
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: error
              });
            }
        }
};