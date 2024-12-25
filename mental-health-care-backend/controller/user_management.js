const prisma = require("../model/connection");
const bcrypt = require("bcrypt");

//create user
const registeruser = async (req, res, next) => {
  try {
    let { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await prisma.rolemaster.findFirst({
      where: {
        name: "User",
      },
      orderBy: {
        id: "asc",
      },
    });

    const user = await prisma.usermaster.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role_id: role.id,
      },
    });

    res
      .status(200)
      .json({ status: true, message: "User Registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//read user
const getusers = async (req, res, next) => {
  try {
    const user = await prisma.usermaster.findMany();
    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update user
const updateuser = async (req, res, next) => {
  try {
    let userId = parseInt(await req.params.id);
    let data = await req.body;

    if (data?.password) {
      const hashedPassword = await bcrypt.hash(data?.password, 10);
      data.password = hashedPassword;
    } else {
      delete data.password;
    }

    let user = await prisma.usermaster.update({
      data: data,
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      result: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//delete user
const deleteuser = async (req, res, next) => {
  try {
    let userId = parseInt(await req.params.id);
    const user = await prisma.usermaster.delete({
      where: {
        id: +userId,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({
      status: true,
      message: "User deleted successfully",
      result: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
module.exports = { registeruser, getusers, updateuser, deleteuser };
