import { useState } from "react";
import { validatePassword } from "../../Utils/validatedata.js";
import { toast } from "react-toastify";
import api from "../../api/Axios.js";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle password change logic here
    if (!currentPassword || !newPassword || !confirmPassword)
      return setErrors("New Password and confirm password do not match!");

    if (currentPassword === newPassword)
      return setErrors("New Password must be different from current one");

    if (newPassword !== confirmPassword) {
      return setErrors("New password and confirm password do not match");
    }

    const error = validatePassword(newPassword);
    if (error) {
      setErrors(error);
      return;
    }

    // Proceed with password change logic
    try {
        setLoading(true);
      const res = await api.put("/users/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      toast.success(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 mb-4 shadow-lg rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {errors && <p className="ml-2 text-red-500 text-sm">{errors}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition cursor-pointer"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
