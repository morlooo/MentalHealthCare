const prisma = require("../model/connection");
const {
  subWeeks,
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
  startOfDay,
  endOfDay,
} = require("date-fns");
const { generateMonths } = require("../utils/dateFormatter");
const {
  generateHoverBackgroundColors,
  generateBackgroundColors,
} = require("../utils/colorGenerator");

//read user
const getDashboardDetails = async (req, res, next) => {
  try {
    const endDate = new Date();

    const from = startOfDay(endDate).toISOString();
    const to = endOfDay(endDate).toISOString();

    let cardDetails = {
      totalUsers: 0,
      totalSurveys: 0,
    };

    const user = await prisma.usermaster.findMany({
      where: {
        id: {
          not: 1,
        },
      },
    });
    const survey = await prisma.formdatamaster.findMany();

    const currentDaysurvey = await prisma.formdatamaster.findMany({
      where: {
        created_at: {
          gte: from,
          lt: to,
        },
      },
    });

    cardDetails.totalUsers = user?.length;
    cardDetails.totalSurveys = survey?.length;
    cardDetails.currentDaysurvey = currentDaysurvey?.length;

    const yearStart = startOfYear(endDate);

    //GENERATING MONTH FOR CHARTS
    const months = generateMonths(yearStart, endDate);

    //CALCULATING TOTAL SURVEYS OVER YEARS
    let surveyData = await Promise.all(
      months.map(async (month) => {
        let nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        let totalSurveys = await prisma.formdatamaster.count({
          where: {
            created_at: {
              gte: month,
              lt: nextMonth,
            },
          },
        });

        return {
          month: month,
          total_surveys: totalSurveys,
        };
      })
    );
    surveyData.sort((a, b) => a.month - b.month);

    let monthViseData = new Map();

    surveyData.forEach((item) => {
      item.month = format(item.month, "MMM");
      monthViseData.set(item.month, item.total_surveys);
    });

    surveyData = {
      labels: [...monthViseData.keys()],
      data: [...monthViseData.values()],
    };

    //CALCULATING TOTAL SURVEY BASED ON MOOD
    let moodData = await prisma.formdatamaster.groupBy({
      by: "current_mood",
      where: {
        created_at: {
          gte: yearStart,
          lt: endDate,
        },
      },
      _count: {
        current_mood: true,
      },
    });

    let moodViseData = new Map();

    moodData.forEach((item) => {
      moodViseData.set(item.current_mood, item?._count?.current_mood);
    });

    const backgroundColor = generateBackgroundColors(moodViseData?.size);
    const hoverBackgroundColor = backgroundColor.map((color) =>
      generateHoverBackgroundColors(color, 40)
    );

    moodData = {
      labels: [...moodViseData.keys()],
      data: [...moodViseData.values()],
      backgroundColor,
      hoverBackgroundColor,
    };

    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: {
        user,
        survey,
        cardDetails,
        surveyData,
        moodData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { getDashboardDetails };
