const express = require('express');
const app = new express();
const cors = require("cors");
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
var serviceAccount = require("../key/logindemo-9d736-firebase-adminsdk-zrs08-eb0adf7d89.json");
const { firestore } = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://logindemo-9d736.firebaseio.com"
});
app.use(cors());
app.use(bodyParser());
app.get('/', (req, res) => res.send('Hello World!'));
app.post("/v1/shop-items", async (req, res) => {
    const item = req.body;
    try {
        let doc = await admin.firestore().collection("shop-item").doc(item.id);
        if ((await doc.get()).exists) {
            res.send({ message: item.id + " is already exists" });
        }
        else {
            doc.set(item);
            res.send({ message: item.id + " is created" });
        }


    } catch (e) {
        res.send({ message: "failed to create " + item.id });
    }
});
app.get("/v1/shop-items", async (req, res) => {
    const item = req.body;
    try {
        let doc = await admin.firestore().collection("shop-item").listDocuments(item);
        let list = [];
        for (let i = 0; i < doc.length; i++) {
            list.push((await doc[i].get()).data());

        }
        res.send({
            items: list
        })
    } catch (e) {
        res.send({ message: "Error" });
    }
});
app.get("/v1/shop-item", async (req, res) => {
    const { id } = req.query;

    if (id == undefined) {
        res.send({
            message: "please set the item id"

        });
        return;
    }
    let data = (await admin.firestore().collection("shop-item").doc(id).get()).data();
    res.send(data);
});
app.delete("/v1/shop-item", async (req, res) => {
    const { id } = req.query;
   
        if (id == undefined) {
            res.send({
                message: "please set the item id"
            });
            return;
        }
        else {
            (await admin.firestore().collection("shop-item").doc(id).delete());
            res.send({ message: id + " đã bị xóa" });
        }
       

});
app.put("/v1/shop-item", async (req, res) => {
    const item = req.body;
    let docRef = admin.firestore().collection("shop-item").doc(item.id);
    let docData = ((await docRef.get()).data())
    try {
        if (docData.id == item.id) {
            await docRef.set(item);
        }
        res.send({ message: docData.id + " is update" });
    } catch (e) {
        res.send({ message: "please choose another id" })
    }
})
app.listen(6969, "127.0.0.1", () => { console.log("server is running") });
