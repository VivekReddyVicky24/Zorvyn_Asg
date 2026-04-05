const Record = require("../models/recordModel");

// Dashboard Summary
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Record.find({ user: userId });

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryMap = {};

    records.forEach((rec) => {
      if (rec.type === "income") {
        totalIncome += rec.amount;
      } else {
        totalExpense += rec.amount;
      }

      // category aggregation
      if (!categoryMap[rec.category]) {
        categoryMap[rec.category] = 0;
      }
      categoryMap[rec.category] += rec.amount;
    });

    const netBalance = totalIncome - totalExpense;

    // recent 5 records
    const recent = await Record.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown: categoryMap,
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};