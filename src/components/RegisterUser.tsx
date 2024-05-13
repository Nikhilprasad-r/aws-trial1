"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { IoMdPersonAdd, IoMdClose } from "react-icons/io";
import { RiImageEditFill } from "react-icons/ri";
import { UserContext } from "@/context/UserContext";
import { FaUserCheck } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

interface RegisterUserFormValues {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  s3Path: string;
  uploadUrl: string;
  imageUrl: string;
}
interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
}
const RegisterUserSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Required"),
  role: Yup.string().required("Role is required"),
});

const RegisterUser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    addUser,
    editedUser,
    setEditedUser,
    setUsers,
    isModalOpen,
    setModalOpen,
    users,
  } = useContext(UserContext);
  useEffect(() => {
    if (editedUser && editedUser.imageUrl) {
      setUploadedImageUrl(editedUser.imageUrl);
    }
  }, [editedUser]);
  const initialValues: RegisterUserFormValues = {
    firstname: editedUser?.firstname || "",
    lastname: editedUser?.lastname || "",
    email: editedUser?.email || "",
    phone: editedUser?.phone || "",
    role: editedUser?.role || "",
    s3Path: "",
    uploadUrl: "",
    imageUrl: editedUser?.imageUrl || "",
    _id: editedUser?._id || "",
  };
  const handleFileChange = async (
    setFieldValue: FormikHelpers<RegisterUserFormValues>["setFieldValue"],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    setFile(selectedFile);
    if (selectedFile) {
      setIsLoading(true);
      try {
        const s3Path = `user/${uuidv4()}.${selectedFile.type.split("/")[1]}`;
        const response = await axios.get("/api/presignedUrl", {
          headers: { "X-File-s3Path": encodeURIComponent(s3Path) },
        });
        const { uploadUrl } = response.data;
        setFieldValue("s3Path", s3Path);
        setFieldValue("uploadUrl", uploadUrl);
        setUploadedImageUrl(URL.createObjectURL(selectedFile));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to get upload URL, please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleSubmit = async (
    values: RegisterUserFormValues,
    { resetForm, setSubmitting }: FormikHelpers<RegisterUserFormValues>
  ) => {
    setSubmitting(true);
    try {
      if (editedUser && file) {
        const s3Path = `user/${uuidv4()}.${file.type.split("/")[1]}`;
        const response = await axios.get("/api/presignedUrl", {
          headers: { "X-File-s3Path": encodeURIComponent(s3Path) },
        });
        const { uploadUrl } = response.data;
        values.s3Path = s3Path;
        values.uploadUrl = uploadUrl;
        values.imageUrl = uploadUrl.split("?")[0];
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });
      }
      if (editedUser) {
        await axios.put(`/api/users/${editedUser._id}`, values);
        const updatedUsers = users.map((user) => {
          if (user._id === editedUser._id) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        const response = await axios.post("/api/signup", values);
        const { userId } = response.data;
        values._id = userId;
        addUser(values);
      }
      Swal.fire({
        title: "Success!",
        text: "User updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      setModalOpen(false);
      resetForm();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data.error || error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full ${
        isModalOpen
          ? "text-black visible opacity-100 ease-in inset-0  bg-black/70"
          : "invisible opacity-0 ease-out"
      } transition-all duration-100`}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterUserSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="max-w-md mx-auto  bg-gray-700 p-5  rounded-lg">
            <div className="flex justify-end py-3 text-red-600 text-2xl">
              <IoMdClose
                onClick={() => {
                  setEditedUser(null);
                  setModalOpen(false);
                }}
              />
            </div>
            <div className="flex items-center justify-center w-full mb-5">
              {uploadedImageUrl ? (
                <div>
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded Image"
                    className="size-[100%] rounded-lg object-cover"
                  />
                  <div className="flex justify-end">
                    <RiImageEditFill
                      className="text-yellow-500 text-2xl"
                      onClick={() => {
                        setUploadedImageUrl(null);
                        setFile(null);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    className="hidden"
                    onChange={(event) => handleFileChange(setFieldValue, event)}
                  />
                </label>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <Field
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address
              </label>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="firstname"
                  id="firstname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="firstname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  First name
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="lastname"
                  id="lastname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="lastname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Last name
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="phone"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone number
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                >
                  <option value="">Select a role</option>
                  <option value="SoftwareTrainee">Software trainee</option>
                  <option value="BackendDeveloper">Backend Developer</option>
                  <option value="FrontEnd">Front End</option>
                  <option value="Devops">Devops</option>
                </Field>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isLoading}
            >
              {editedUser ? <FaUserCheck /> : <IoMdPersonAdd />}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterUser;
