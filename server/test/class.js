const Class = require("../models/class")


const success  = Class({
    id: "3",
    name: "Tarbiyat Saifiyah",
    teachers: [
        {
            "name": "Zainab ben Garbadawala",
            "phone": "551 200 406".replaceAll(new RegExp("-| ", "g"), "")
        }
    ]
})

if(!success.valid) {
    console.log(success.errors[0]);
} else {
    console.log("Valid class");
}