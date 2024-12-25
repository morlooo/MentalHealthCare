const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const passport = require("../config/passport");
const { generateToken } = require("../config/jwt");
const dotenv = require("dotenv");
const prisma = require("../model/connection");
dotenv.config({ path: ".env" });

const loginUser = async (req, res, next) => {
  try {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        try {
          if (err) {
            console.log(err.message);
            return res
              .status(500)
              .json({ status: false, message: "Internal Server Error" });
          }

          console.log("user :>> " ,user)

          if (!user) {
            return res
              .status(401)
              .json({ status: false, message: info.message });
          }

          // Password is correct, generate a JWT token
          const { token, payload } = generateToken(user);

          // Return the token in the response
          console.log("Generated token: ", token);
          return res
            .status(200)
            .json({
              status: true,
              message: "login scucessful",
              token: token,
              payload: payload,
            });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    )(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendOtp = async (req, res, next) => {
  try {
    let { email } = await req.body;

    // Determine whether to use SSL or TLS based on the mail configuration
    smtpConfig = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },

    };

    let transporter = nodemailer.createTransport(smtpConfig);
    let { otp, secret, timestamp } = generateOtp();

    let body = ` Dear ${email}

We received your request to reset your password. 

Here is your One-Time-Passcode (OTP): ${otp} to reset your password.

    Thank you`;

    let mailOptions = {
      from: `"Mental Health checkin" <project@msquaretec.com>`,
      to: email,
      subject: "Reset Your Password with - One Time Passcode",
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Failed to send mail" });
      } else {
        console.log(`Message sent: ${info.messageId}`);
        res
          .status(200)
          .json({
            status: true,
            message: "email sent successfully",
            result: {
              messageId: info.messageId,
              time_stamp: timestamp,
              sec_code: secret,
            }
          });
        
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("404 not found");
  }
};

const verifyOtp = async (req, res, next) => {
  let { otp } = await req.body;
  let { sec_code, time_stamp } = await req.query;
  const otpValidWindow = 4 * 30 * 1000; // OTP valid for 2 steps (60 seconds)

  let verified = speakeasy.totp.verify({
    secret: sec_code,
    encoding: "base32",
    token: otp,
    window: 4, // Allow OTPs valid for 2 steps
    step: 120, // OTP changes every 30 seconds
  });

  if (verified) {
    console.log(`otp verified`);
    res.status(200).json({ status: true, message: "otp verified" });
  } else if (Date.now() - time_stamp > otpValidWindow) {
    console.log(`OTP expired`);
    res.status(200).json({ status: false, message: "OTP expired" });
  } else {
    console.log(`Invalid OTP`);
    res.status(200).json({ status: false, message: "Invalid OTP" });
  }
};

const generateOtp = () => {
  // Generate a secret key
  const secret = speakeasy.generateSecret({ length: 10 }); // Adjust the length as needed

  // Get the OTP for the current time
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    digits: 6,
    step: 120,
  });

  let timestamp = Date.now(); // Record the timestamp of OTP generation

  console.log("Secret:", secret.base32); // Store this secret securely for verification
  console.log("Timestamp:", timestamp); // Store this secret securely for verification
  console.log("Current OTP:", otp);

  return { secret: secret.base32, otp, timestamp };
};

const resetPassword = async (req, res, next)=>{
  try {
    let Id = +(req.params.id);

    if(!req.body.new_password){
      return res.status(400).json({status: false, message: "New password is required"});
    }
    //hash new password
    let newPasswordHash = await bcrypt.hash(req.body.new_password, 10);

    //object for update
    let updateData = {
      password: newPasswordHash,
    };

    const result = await prisma.usermaster.update({
      where:{
        id: Id,
      },
      data: updateData,
      select:{
        password: true,
        id: true,
      }
    });
    console.log(result);
    res.status(200).json({status: true, message: 'Password Updated successfully', result});
    
  } catch (error) {
    console.log(error)
    res.status(500).json({status: false, message: 'Internal server error'})
  }
}

module.exports = { loginUser, sendOtp, verifyOtp, resetPassword };
