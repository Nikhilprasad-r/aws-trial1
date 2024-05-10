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

interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
}

const AdminPanel = () => {
  const { users, setUsers, setEditedUser, setModalOpen, isModalOpen } =
    useContext(UserContext);

  const deleteUser = async (id: string) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-emerald-800 text-white px-4 py-2 rounded-md mx-2",
        cancelButton: "bg-rose-900 text-white px-4 py-2 rounded-md mx-2",
      },
      buttonsStyling: false,
    });

    const result = await swalWithTailwindButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        console.log("Deleting user with id:", id);
        await axios.delete(`/api/users/${id}`);
        const newUsers = users.filter((user) => user._id !== id);
        setUsers(newUsers);
        swalWithTailwindButtons.fire(
          "Deleted!",
          "Your file has been deleted.",
          "success"
        );
      } catch (error) {
        swalWithTailwindButtons.fire(
          "Failed!",
          "Could not delete the user.",
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithTailwindButtons.fire(
        "Cancelled",
        "Your imaginary file is safe :)",
        "error"
      );
    }
  };
  const generatePassword = async (id: string) => {
    try {
      const response = await axios.post(`/api/generate-password/${id}`);
      Swal.fire({
        title: "Password generated!",
        text: `The new password is sent to the user's email.`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "Could not generate password.",
        icon: "error",
      });
    }
  };

  const editUser = (user: UserData) => {
    setEditedUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setUsers]);

  console.log(users);

  return (
    <div>
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
                  console.log("jkbdjc", user);
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
                          onClick={() => deleteUser(user._id)}
                          className="font-medium text-blue-600 dark:text-blue-500 mx-auto hover:underline cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <TbPasswordUser
                          onClick={() => {
                            generatePassword(user._id);
                            console.log(
                              "generate btoo password for user with id:",
                              user
                            );
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
