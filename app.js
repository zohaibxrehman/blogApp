var bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	express = require('express'),
	methodOverride = require('method-override'),
	app = express();

mongoose.connect('mongodb://localhost:27017/blogApp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
// 	title: 'Test Blog',
// 	image: '',
// 	body: 'Body of the test blog'
// });

app.get('/', function(req, res) {
	res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { blogs });
		}
	});
});

app.get('/blogs/new', function(req, res) {
	res.render('new');
});

app.get('/blogs/:id', function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/');
		} else {
			res.render('show', { blog: foundBlog });
		}
	});
});

app.post('/blogs', function(req, res) {
	Blog.create(req.body.blog, function(err, newBlog) {
		if (err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/")
		} else {
			res.render("edit", {blog: blog});
		}
	});
 });
 
 app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
		if(err){
			console.log(err);
		} else {
		  res.redirect("/blogs/" + blog._id);
		}
	});
 });

app.listen(3000, function() {
	console.log('The BlogApp serving on PORT 3000');
});
