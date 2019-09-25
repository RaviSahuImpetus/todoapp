var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/todo');

// Create a schema
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'Buy Flowers'}).save(function(err) {
//     if(err) throw err;
//     console.log('Item Saved');
// });

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'get veggies'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {
    
    app.get('/todo', function(req, res, next){
        // get data from MongoDB and pass it to view
        Todo.find({}, function(err, data) {
            if(err) return next(err);
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, function(req, res, next){
        // get data from the view and add it to MongoDB
        var newTodo = Todo(req.body).save(function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });

    app.delete('/todo/:item', function(req, res, next){
        // delete the requested item from MongoDB
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });

    app.get('/contact', function(req, res){
        res.render('contact');
    });

    // Error Handler Middlerware
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        next(err);
    });
};