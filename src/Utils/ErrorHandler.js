import Swal from "sweetalert2";

export const handleApiError = (err) => {
  let message = "Something went wrong!";

  if (err.response?.data?.error) {
    message = err.response.data.error;
  } else if (err.response?.data?.message) {
    message = err.response.data.message;
  } else if (err.error) {
    message = err.error;
  } else if (err.message) {
    message = err.message;
  }

  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#3085d6",
  });
}
  export const handleApiSuccess = (res) => {
    console.log(res);
    let message = res.message ? res.message : "Sucess";
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#3085d6",
  })
}
