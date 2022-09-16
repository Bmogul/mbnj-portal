const Parent = require("../models/parent")
const success  = Parent({
    its: "12345678",
    name: "abcuewfbef",
    phone: "7323185300",
    emails: ["afinitaher@gmail.com"]
})

if(!success.valid) {
    console.log(success.errors);
}