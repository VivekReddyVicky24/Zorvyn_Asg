const Record = require("../models/recordModel");

// CREATE
exports.createRecord = async (req, res) => {
  try {
    const record = await Record.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (with filters and pagination)
exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 5, search } = req.query;

    let filter = { user: req.user._id, isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔍 Search logic
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    // 🔥 Pagination logic
    const skip = (page - 1) * limit;

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // total count (for frontend)
    const total = await Record.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Soft delete
    record.isDeleted = true;
    await record.save();

    res.json({ message: "Record removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};