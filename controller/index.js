import fs from 'fs';
import tsv from 'tsv';
import score from 'string-score';

let fetchData = {};
export default class SuggestionController {
    static async suggestion( req, res ) {
         // Read in TSV and parse data
        fs.readFile("./data/cities_canada-usa.tsv", "utf8", (error, data) => {
            fetchData = tsv.parse(data);
        });

        // Get the string score
        let getScore = (data, term) => {
            const suggestions = [];

            // Create and push new object with score
            data.map(city => {
                suggestions.push ({
                    name: city.name,
                    latitude: city.lat,
                    longitude: city.long,
                    score: score(city.name, term).toFixed(2)
                });
            });

            // Sort in descending order
            suggestions.sort((a,b) => {
                return b.score - a.score;
            });

            return suggestions;
        }

        try {
            const inputs = req.query.q.toLowerCase().trim();
          
            if ( inputs.length > 0) {

                const filteredCities = fetchData.filter(city => {
                   return ((city.population > 5000) && ((city.name.toLowerCase().includes(inputs) || city.alt_name.toLowerCase().split(",").includes(inputs))))
                });
                const suggestions = getScore(filteredCities, inputs)
                return res.status(200).json({suggestions});
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'Invalid search term'
                  });
            };
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: error
              });
            };
        };
};