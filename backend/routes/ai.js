module.exports = function (app, middleware, database) {

    app.put('/GETrunAStarAlgorithm', async (req, res) => {
        try {
          // Await the data in order
          const attributes = await database.pokemon.getAllCharacterAttributes();
          const tierList = await database.pokemon.formatTierList();
      
          // Pass those into your AI function if it needs them
          const data = await database.ai.runAStarAlgorithm(
            req.body.targetTeam,
            req.body.opposingTeam,
            req.body.bans,
            attributes,
            tierList
          );
      
          res.json(data);
        } catch (error) {
          console.error('Error running a_star algorithm:', error);
          res.sendStatus(401);
        }
    });  

    app.put('/GETrateComp', async (req, res) => {
        try {
            const attributes = await database.pokemon.getAllCharacterAttributes();
            const tierList = await database.pokemon.formatTierList();
            const data = await database.ai.rateComp(req.body, attributes, tierList);
            res.json(data);
        } catch (error) {
            console.error('Error rating comp:', error);
            res.sendStatus(401);
        }
    });

}