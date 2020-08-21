const bodyParser=require('body-parser');
const mongoose=require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
mongoose.connect('mongodb://localhost:27017/nittdb', {useNewUrlParser: true})
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

const userSchema=new mongoose.Schema({
    name:String,
    roll:String,
    dob:String,
})
const User =new mongoose.model('user',userSchema);

app.get('/users',function(req,res){
    User.find({},function(err,arr){
        res.send(arr)
    })
})
app.get('/register',function(req,res){
    res.render('register',{})
})
app.get('/',function(req,res){
    res.render('home',{});
})
app.get('/update',function(req,res){
    res.render('update',{})
    
})
app.get('/delete',function(req,res){
    User.find({},function(err,arr){
        res.render('delete',{arr:arr});
    })
})
app.post('/update',function(req,res){
    roll=req.body.roll;
    name=req.body.name;
    dob=req.body.dob;
    User.update({roll:roll},{$set:{name:name,dob:dob}},function(err,succ){
        if(err){
            console.log(err);
        }
        else{
            console.log(succ);
        }
    })
    res.redirect('/')
})
app.post('/register',function(req,res){
    user = new User({
        name:req.body.name,
        roll:req.body.roll,
        dob:req.body.dob
    })
    user.save();
    res.redirect('/');
})
io.on('connection', function(socket) {
    socket.on('delete',function(data){
        console.log(data);
        User.deleteOne({roll:data[1],name:data[0]},function(err,succ){

        })
    })
})
http.listen(3000, function() {
    console.log('listening on *:3000');
 });