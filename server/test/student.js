const Student = require("../models/student")


const success  = Student({
    its: "30114664",
    firstName: "Burhanuddin",
    lastName: "Saifee",
    fullName: "Burhanuddin Shaikh Shabbir bhai Saifee",
    // arabicName: "برهان الدين الشيخ شبير بهائي الصيفي",
    grade: "Rabea",
    gradeNum: "4",
    // arabicGrade: "الرابعة",
    gender: "Male",
    dob: "2014-03-24",
    allergies: "None",
    feesPaid: "full",
    booksCollected: false,
    attendanceClass: {
        "id": "3",
        "name": "Tarbiyat Saifiyah",
        "teachers": [
            {
                "name": "Zainab ben Garbadawala",
                "phone": "551 200 4060"
            }
        ]
    },
    family: {
        id: "1069",
        address: "341 Dunhams Corner;East Brunswick;NJ;08816"
    },
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
    ],
    status: "active"
})

if(!success.valid) {
    console.log(success.errors);
} else {
    console.log("Valid student");
}