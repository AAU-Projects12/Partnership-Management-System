import User from "../Models/user.model.js";
import AuditLog from "../Models/auditLog.model.js";
import Notification from "../Models/notification.model.js";

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.status = "Approved";
    await user.save();

    await AuditLog.create({
      action: "APPROVE_USER",
      performedBy: req.user._id,
      targetId: user._id,
      details: `Approved user ${user.email}`,
    });

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changeUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.role = role;
    await user.save();

    await AuditLog.create({
      action: "CHANGE_ROLE",
      performedBy: req.user._id,
      targetId: user._id,
      details: `Changed role to ${role}`,
    });

    res.status(200).json({ message: `Role changed to ${role}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const notifyAdminsOnRegister = async (newUser) => {
  const admins = await User.find({
    role: { $in: ["CampusAdmin", "SuperAdmin"] },
    status: "Approved",
  });
  const notifications = admins.map((admin) => ({
    user: admin._id,
    message: `New user registered: ${newUser.firstName} ${newUser.lastName}`,
    type: "registration",
  }));
  await Notification.insertMany(notifications);
};
