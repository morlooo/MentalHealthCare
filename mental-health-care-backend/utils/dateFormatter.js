let {
    add,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachDayOfInterval,
  } = require("date-fns");
  
  function getFormat(date) {
    try {
      let data = date.split("-");
  
      return `${data[1]}-${data[0]}-${data[2]}`;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }
  
  function generateMonths(startDate, endDate) {
    try {
      const months = [];
      const date = new Date(startDate);
      endDate = new Date(endDate);
  
      while (date <= endDate) {
        months.push(new Date(date));
        date.setMonth(date.getMonth() + 1);
      }
  
      return months;
    } catch (error) {
      console.error(error);
      logger.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }
  
  function convertToIndianStandard(date) {
    try {
      return add(date, {
        hours: 5,
        minutes: 30,
      });
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }
  
  function getDateRange(startDate, endDate, criteria = "year") {
    try {
      // Parse input dates
      let start = new Date(startDate);
      let end = new Date(endDate);
      let range;
  
      // Get array of all months within the interval
      switch (criteria) {
        case "year":
          range = eachMonthOfInterval({ start, end });
          break;
  
        case "month":
          range = eachWeekOfInterval({ start, end });
          break;
  
        case "week":
          range = eachDayOfInterval({ start, end });
          break;
  
        default:
          console.log("invalid value provided");
          break;
      }
  
      return range;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }
  
  module.exports = {
    getFormat,
    generateMonths,
    convertToIndianStandard,
    getDateRange,
  };
  