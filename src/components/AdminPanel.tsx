"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { UserContext } from "@/context/UserContext";
import { TbPasswordUser } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import RegisterUser from "./RegisterUser";
import Swal from "sweetalert2";
import { UserData } from "@/app/utils/types/user.d";
import {
  cancelAlert,
  confirmDeleteAlert,
  deleteAlert,
  errorAlert,
  passwordAlert,
} from "./ui/sweetalert";
import Loader from "./ui/Loader";

const AdminPanel = () => {
  const [isLoading, setisLoading] = useState(false);
  const { users, setUsers, setEditedUser, setModalOpen, isModalOpen } =
    useContext(UserContext);

  const deleteUser = async (user: UserData) => {
    const result = await confirmDeleteAlert();
    setisLoading(true);

    if (result.isConfirmed) {
      try {
        if (user.s3Path) {
          await axios.delete("/api/s3-api/deletefile", {
            headers: { "X-File-s3Path": encodeURIComponent(user.s3Path) },
          });
        }
        const id = user._id;
        await axios.delete(`/api/users/${id}`);
        const newUsers = users.filter((user) => user._id !== id);
        setUsers(newUsers);
        setisLoading(false);
        deleteAlert();
      } catch (error) {
        setisLoading(false);
        errorAlert("Could not delete user.");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      setisLoading(false);
      cancelAlert("User deletion cancelled.");
    }
  };
  const generatePassword = async (id: string) => {
    setisLoading(true);
    try {
      const response = await axios.post(`/api/generate-password/${id}`);
      setisLoading(false);
      passwordAlert();
    } catch (error) {
      setisLoading(false);
      errorAlert("Could not generate password.");
    }
  };

  const editUser = (user: UserData) => {
    setEditedUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      try {
        const response = await axios.get("/api/users/");
        setUsers(response.data);
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
        errorAlert("Could not fetch users.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      <div className="p-4 sm:ml-64">
        <div
          className="flex justify-end py-3 text-green-600 cursor-pointer text-xl"
          onClick={() => {
            setEditedUser(null);
            setModalOpen(true);
          }}
        >
          <FaUserPlus />
          Add user
        </div>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Edit
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delete
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Regenerate Password
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr
                      key={user._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                      >
                        {user.firstname + " " + user.lastname}
                      </th>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        <FaEdit
                          onClick={() => editUser(user)}
                          className="font-medium text-blue-600 dark:text-blue-500 mx-auto hover:underline cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <MdDeleteForever
                          onClick={() => deleteUser(user)}
                          className="font-medium text-blue-600 dark:text-blue-500 mx-auto hover:underline cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <TbPasswordUser
                          onClick={() => {
                            generatePassword(user._id);
                          }}
                          className="font-medium text-blue-600 dark:text-blue-500 mx-auto hover:underline cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && <RegisterUser />}
    </div>
  );
};

export default AdminPanel;
