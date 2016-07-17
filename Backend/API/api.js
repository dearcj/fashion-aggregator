module.exports = {
    setupAPI: function (app, router) {
        app.use('/api', router);
        router.get('/', function(req, res) {
            res.json({ message: 'hooray! welcome to our api!' });
        });

    }


}