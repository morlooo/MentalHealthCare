const prisma = require("../model/connection");
const bcrypt = require("bcrypt");
const { get } = require("../routes");
const { lt } = require("date-fns/locale");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const HEALTH_STATUS = require("../constants/HealthStatus");

//create form
const fillform = async (req, res, next) => {
  try {
    let { current_mood, current_stress_level, feelings, ...questions } =
      req.body;
    const todayDate = new Date();
    let userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User id is required" });
    }

    const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999));

    const existingData = await prisma.formdatamaster.findFirst({
      where: {
        AND: [
          {
            created_at: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            user_id: +userId,
          },
        ],
      },
    });

    if (existingData) {
      return res.status(400).json({
        status: false,
        message: "Already Checked In Today",
      });
    }

    const trackerResponse = await axios.post(
      "http://clever-lacey-ayushpawar-027c55b5.koyeb.app/",
      {
        ...questions,
      }
    );

    const { Prediction } = await trackerResponse?.data;

    const form = await prisma.formdatamaster.create({
      data: {
        user_id: userId,
        current_mood: current_mood,
        current_stress_level: current_stress_level,
        feelings: feelings,
        health_status: HEALTH_STATUS[Prediction],
      },
    });

    res.status(200).json({
      status: true,
      message: "Form submitted successfully",
      result: form,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//read form
const getforms = async (req, res, next) => {
  try {
    let forms = await prisma.formdatamaster.findMany({
      include: {
        usermaster: {
          select: {
            name: true,
          },
        },
      },
    });

    forms = forms.map((form) => {
      let { usermaster, feelings, created_at, ...data } = form;
      form = { name: usermaster?.name, ...data, feelings, date: created_at };
      return form;
    });
    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: forms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//read form by id
const getuserform = async (req, res, next) => {
  try {
    let user_id = parseInt(await req.params.id);

    let count = await prisma.formdatamaster.count({
      where: {
        user_id: user_id,
      },
    });

    if (count === 0) {
      res.status(404).json({ status: false, message: "data not found" });
    } else {
      const form = await prisma.formdatamaster.findFirst({
        where: {
          user_id: user_id,
        },
        select: {
          user_id: true,
          current_mood: true,
          current_stress_level: true,
          feelings: true,
          usermaster: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      form = { name: form?.usermaster?.name, ...form };
      delete form?.usermaster;

      res.status(200).json({
        status: true,
        message: "data fetched successfully",
        result: form,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//update form
const updateform = async (req, res, next) => {
  try {
    let formId = parseInt(await req.params.id);
    let data = await req.body;

    let form = await prisma.formdatamaster.update({
      data: data,
      where: {
        id: formId,
      },
    });

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      result: form,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//delete form
const deleteform = async (req, res, next) => {
  try {
    let formId = parseInt(await req.params.id);
    const form = await prisma.formdatamaster.delete({
      where: {
        id: +formId,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({
      status: true,
      message: "Form data deleted successfully",
      result: form,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//validate date
const validatedate = async (req, res, next) => {
  try {
    const todayDate = new Date();
    let userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User id is required" });
    }

    const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999));

    const existingData = await prisma.formdatamaster.findFirst({
      where: {
        AND: [
          {
            created_at: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            user_id: +userId,
          },
        ],
      },
    });

    if (existingData) {
      return res.status(400).json({
        status: false,
        message: "Entry already exists for this date",
        result: { checkedIn: true, date: existingData?.created_at },
      });
    }

    res.status(200).json({
      status: true,
      message: "No entry found for this date",
      result: { checkedIn: false },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  fillform,
  getforms,
  getuserform,
  updateform,
  deleteform,
  validatedate,
};
