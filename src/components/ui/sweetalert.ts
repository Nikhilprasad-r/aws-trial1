import Swal from "sweetalert2";

export const successAlert = (message: string) =>
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    confirmButtonText: "OK",
  });

export const errorAlert = (message: string) =>
  Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });

export const deleteAlert = () =>
  Swal.fire({
    title: "Deleted!",
    text: "User deleted successfully",
    icon: "success",
    confirmButtonText: "OK",
  });

export const cancelAlert = (message: string) =>
  Swal.fire({
    title: "Cancelled",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });

export const passwordAlert = () =>
  Swal.fire({
    title: "Password generated!",
    text: "The new password is sent to the user's email.",
    icon: "success",
    confirmButtonText: "OK",
  });

export const confirmDeleteAlert = () =>
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  });
