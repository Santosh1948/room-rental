const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Regis
const register = async(req, res) => {
    try{
        const {name, email, phone, password } = req.body ;

        if(!name || !email || !password  ){
            return res.status(400).json({
                success : false,
                message : "Name , email and password are required"
            });

        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                success : false,
                message: "User already exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password : hashedPassword,
            role : "USER"
        });


        return res.status(201).json({
            success: true,
            message : "User register successfully",
            user : {
                id : user._id,
                name: user.name,
                email : user.email,
                role:  user.role
            }
        });


    }catch(error){
        console.error("Register Error:", error.message);

        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        });
    }
}

//Login

const login = async (req, res) => {
    try {
        const {email, password} = req.body || {};

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Email and password are require"
            });

        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({
                success : false,
                message: "Invalid Email "
            });
        }


        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message : "Invalid password "
            })
        }


        const token = jwt.sign(
            {
                userId : user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : process.env.JWT_EXPIRES_IN || "1d"
            }
        );


        return res.status(200).json({
            success : true,
            message : " Login successful",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        })


    }catch(error){
        console.error("Login Error :", error);


        return res.status(500).json({
            success : false,
            message : "Internal Server error"
        });
    }
};

module.exports = {
    register,
    login
};