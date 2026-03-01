import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);

  const handleUpdate = () => {
    dispatch(updateUser({ userId: user._id, username: newUsername }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(user._id));
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-800 shadow-lg rounded-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>

      <div className="flex items-center gap-6">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-500 shadow"
        />
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-semibold text-gray-100">{user.fullname}</h3>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-sm text-gray-400">
            User ID: <span className="text-xs text-gray-700">{user._id}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => setEditModalOpen(true)}
          className="w-full md:w-1/2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="w-full md:w-1/2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded shadow"
        >
          Delete Account
        </button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 space-y-4">
            <h3 className="text-xl font-semibold text-gray-100">Update Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 space-y-4">
            <h3 className="text-xl font-semibold text-gray-100">Confirm Deletion</h3>
            <p className="text-gray-300">Are you sure you want to delete your account?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
