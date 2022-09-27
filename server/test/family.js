const Family = require("../models/family")


const success  = Family({
    id: "1006",
    address: "20 Linda Court;Monmouth Junction;NJ;08852",
    username: "ahmedali4u@gmail.com",
    password: "mbnj@78653",
    tokens: [],
    parents: [
        {
            its: "30334906",
            name: "Ahmedali bhai Lokhandwala",
            phone: "415-516-3484".replaceAll(new RegExp("-| ", "g"), ""),
            emails: ["ahmedali4u@gmail.com"]
        },
        {
            its: "30321562",
            name: "Tasneem bai Ahmedali bhai Lokhandwala",
            phone: "917-250-2716".replaceAll(new RegExp("-| ", "g"), ""),
            emails: ["tassingaporewala@gmail.com"]
        }
    ]
})

if(!success.valid) {
    console.log(success.errors);
} else {
    console.log("Valid family");
}