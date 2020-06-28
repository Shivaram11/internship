const admin = require("firebase-admin");
const express = require("express");
const app = express();
const multer= require("multer");
const upload = multer({'dest':'uploads/'});
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'dvfq4dlyh',
    api_key: '875314247466293',
    api_secret: 'DJNzdF7lcdem2bo1yLx2IuMgqoI'
});
// cloudinary.config({
//     cloud_name: "dvfq4dlyh",
//     api_key: "875314247466293",
//     api_secret: process.env.CLOUDINARY_SECRET
// });
app.use(express.static('public'));
app.use(express.urlencoded());


app.set('view engine', 'ejs');


var serviceAccount = require("./accessKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://internshala-29d10.firebaseio.com"
});

const db = admin.firestore();
// const snapshot='';
  var dataArray=[]
async function getData(){
     const snapshot = await db.collection('diary-data').get();
   dataArray=snapshot;

}

app.get("/",async (req,res)=>{
    await getData();
    res.render("index",{snapshot:dataArray});

});

app.get("/posts/:id/edit",async(req,res)=>{
    
     const snapshot = await db.collection('diary-data').doc(req.params.id).get();
    
    
    res.render("edit", {
        snapshot: snapshot
    });


});


app.post("/posts/:id/edit",async (req,res)=>{
    console.log(req.params.id);
    await db.collection('diary-data').doc(req.params.id).set({
        title:req.body.title,
        content:req.body.content
    });
    res.redirect("/")
    

});
app.get("/new",(req,res)=>{
    res.render("new");

});
app.post("/new",async(req,res)=>{
await db.collection('diary-data').doc().set({
    title:req.body.title,
    content:req.body.content
});
res.redirect("/");

});
app.post("/posts/:id/delete",async(req,res)=>{
await db.collection('diary-data').doc(req.params.id).delete();
res.redirect("/");
});

app.get("/file",async(req,res)=>{
         const snapshot = await db.collection('image-url').get();

res.render("file",{snapshot:snapshot});
});
app.post("/file", upload.array('images',4),async(req, res) => {
  

    
    for (const file of req.files) {
        let image = await cloudinary.uploader.upload("uploads/" + file.filename );
        console.log(image);
        await db.collection('image-url').doc().set({
            url: image.url
            
        });
        
    }


   
res.redirect("/");
});

app.listen(3000,(req,res)=>console.log("server has started"));