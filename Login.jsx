import { Box, Modal } from "@mui/material";
import axios from "axios";
import { decodeJwt } from "jose";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FaFacebook, FaLinkedin, FaUser } from "react-icons/fa";
import { FaLock, FaSquareXTwitter, FaUnlockKeyhole } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "react-use";
import Swal from "sweetalert2";
import * as Yup from "yup";
import animationData from "../animation/Cfl_login.json";
import useStore from "../component/ZustandStore";
import CflLogo from "../image/CflLogo.png";
import CompanyLogo from "../image/CompanyLogo.png";
import StartSmart from "../image/StartSmart.svg";

function Login() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "67vh",
    overflowY: "auto",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [eye, setEye] = useState(true);
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    userName: "",
    userPassword: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const [startSmartRole, setStartSmartRole] = useState([]);

  const options1 = ["SELECT", ...startSmartRole];

  const defaultOption1 = options1[0];
  const [userRole, setUserRole] = useState("");

  const handleSelect = (selectedOption) => {
    setUserRole(`${selectedOption.value}`);
  };

  const [startSmartPopRole, setStartSmartPopRole] = useState([]);

  const options2 = ["SELECT", ...startSmartPopRole];

  const defaultOption2 = options1[0];
  const [userRolePop, setUserRolePop] = useState("");

  const handleSelectPop = (selectedOption) => {
    setUserRolePop(`${selectedOption.value}`);
  };

  // useEffect(() => {
  //   if (login?.userName?.length >= 10) {
  //     axios
  //       .get(
  //         `http://localhost:8080/findListOfRolesByUserName/${login?.userName}`
  //       )
  //       .then((res) => {
  //         console.log(res?.data, "^^^^^^^^^^^^^^^^^^^^^^");
  //         const listData = res?.data?.map((i) => i?.role);
  //         if (listData?.length == 1) {
  //           setUserRole(listData?.join(""));
  //         } else {
  //           setStartSmartRole(listData);
  //         }
  //       })
  //       .catch(() => {
  //         Swal.fire({
  //           text: "enter email",
  //         });
  //       });
  //   }
  // }, [login?.userName]);

  // Regex for emails ending with .in or .com
  const emailRegex = /^[^\s@]+@[^\s@]+\.(in|com)$/i;

  const findRoles = () => {
    if (emailRegex.test(login.userName)) {
      axios
        .get(
          `http://localhost:8080/findListOfRolesByUserName/${login.userName}`
        )
        .then((res) => {
          const listData = res.data.map((i) => i.role);

          if (listData?.length === 1) {
            setUserRole(listData?.join(""));
          } else {
            setStartSmartRole(listData);
          }
        })
        .catch(() => {
          Swal.fire({
            text: "Failed to fetch roles. Please enter a valid email.",
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    findRoles();
  }, [login.userName]); // Dependency on userName

  console.log(startSmartRole, "startSmartRol^^^^^^^^^^^^^^^^^e");

  console.log(login.userName, "user name eeeeeeeeeeeeeeeeee");

  const { jwtData, setJwtData, setIsAuthenticated, setRoleName, roleName } =
    useStore();

  console.log(roleName, "myRoleName....");

  // Define Yup validation schema
  const loginSchema = Yup.object().shape({
    userName: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    userPassword: Yup.string().required("Password is required"),
  });

  // useEffect(() => {
  //   if (jwtData) {
  //     setJwtData(jwtData);
  //   }
  // }, [jwtData]);

  // const handleLogin = () => {
  //   const loginWithJwt = (jwtToken) => {
  //     // Validate the form data
  //     loginSchema
  //       .validate(login)
  //       .then(() => {
  //         console.log(login, "login");
  //         axios
  //           .post("http://localhost:8080/login", login, {
  //             headers: {
  //               Authorization: `Bearer ${jwtToken}`,
  //             },
  //           })
  //           .then((res) => {
  //             console.log(res.data, "logindata");
  //             setIsAuthenticated(true);
  //             const decoded = decodeJwt(jwtToken);
  //             setRoleName(decoded?.authorities || []);
  //             Swal.fire("Login Successfully");
  //             navigate("/cfl-dashboard");
  //           })
  //           .catch((error) => {
  //             Swal.fire("Wrong Details Filled !!!");
  //           });
  //       })
  //       .catch((err) => {
  //         // Show validation errors
  //         Swal.fire(err.errors[0]);
  //       });
  //   };

  //   if (Object.values(jwtData).length === 0) {
  //     // JWT data is not available, so refresh it first
  //     loginSchema
  //       .validate(login)
  //       .then(() => {
  //         axios
  //           .get(`http://localhost:8080/jwtWithRefreshToken/${login?.userName}`)
  //           .then((res) => {
  //             console.log(res.data, "login username");

  //             axios
  //               .post(`http://localhost:8080/refresh/${res.data}`)
  //               .then((res) => {
  //                 console.log(res.data, "new data");
  //                 const newJwtData = res.data;
  //                 setJwtData(newJwtData); // Update jwtData

  //                 // Use the newJwtData directly for login
  //                 loginWithJwt(newJwtData);
  //               })
  //               .catch((error) => {
  //                 Swal.fire("Failed to refresh token!");
  //               });
  //           })
  //           .catch((error) => {
  //             Swal.fire("Your Account Expired Register Again !!!");
  //           });
  //       })
  //       .catch((err) => {
  //         // Show validation errors
  //         Swal.fire(err.errors[0]);
  //       });
  //   } else {
  //     // JWT data is already available, use it directly for login
  //     loginWithJwt(jwtData);
  //   }
  // };

  // useEffect(() => {
  //   if (jwtData) {
  //     setJwtData(jwtData);
  //   }
  // }, [jwtData]);

  // const loginOnKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     handleLogin();
  //   }
  //   // console.log("Key pressed:", typeof event.key);
  //   // Call any other function here, like onkeydown()
  // };

  // document.addEventListener("keydown", loginOnKeyPress);

  // const loginOnKeyPress = (event) => {
  //   // Check if the Enter key is pressed
  //   if (event.key === "Enter") {
  //     event.preventDefault(); // Prevent the default action (like form submission or page reload)
  //     handleLogin();
  //   }
  // };

  // // Make sure the event listener is added only once
  // document.addEventListener("keydown", loginOnKeyPress);

  const [keyPressed, setKeyPressed] = useState(false); // State to track if a key was pressed

  useEffect(() => {
    // This effect will run whenever keyPressed changes
    if (keyPressed) {
      // Handle the logic when key is pressed
      console.log("Key pressed, running handleLogin...");
      handleLogin();

      // Reset the keyPressed state to false after handling the login
      setKeyPressed(false);
    }
  }, [keyPressed]); // Dependency array includes keyPressed, so the effect runs when it changes

  const loginOnKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default action like form submission
      setKeyPressed(true); // Set keyPressed state to true, triggering the effect
    }
  };

  useEffect(() => {
    // Add event listener for key press
    document.addEventListener("keydown", loginOnKeyPress);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", loginOnKeyPress);
    };
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleLogin = () => {
    const loginWithJwt = () => {
      // Validate the form data
      // loginSchema
      //   .validate(login)
      //   .then(() => {
      //     console.log(login, "login");
      axios
        .post(`http://localhost:8080/login/${userRole}`, login)
        .then((res) => {
          console.log(res.data, "logindata");
          setIsAuthenticated(true);
          const jwtToken = res?.data?.token;
          setJwtData(jwtToken);
          const decoded = decodeJwt(jwtToken);
          setRoleName(decoded?.authorities || []);

          Swal.fire({
            html: "<p><strong>Login successful</strong><p>",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            width: "350px",
          });

          navigate("/cfl-dashboard");
        })
        .catch((error) => {
          // Swal.fire({
          //   //title: 'Error',
          //   title: "Wrong details filled",
          //   width: "370px",
          // });
          //   Swal.fire({
          //     title: '<span style="font-weight: 200;">Wrong details filled</span>',
          //     width: "370px",
          // });
          Swal.fire({
            title:
              '<span style="font-weight: 400; font-size: 20px;">Wrong details filled</span>', // Adjust the font size as needed
            width: "350px",
          });
        });
    };
    // })
    // .catch((err) => {
    //   // Show validation errors
    //   Swal.fire(err.errors[0]);
    // });

    if (Object.values(jwtData).length === 0) {
      // JWT data is not available, so refresh it first
      loginSchema
        .validate(login)
        .then(() => {
          axios
            .get(
              `http://localhost:8080/jwtWithRefreshToken/${login?.userName}/${userRole}`
            )
            .then((res) => {
              console.log(res.data, "login username");

              axios
                .post(`http://localhost:8080/refresh/${res.data}`)
                .then((res) => {
                  console.log(res.data, "new data");
                  const newJwtData = res.data;
                  setJwtData(newJwtData); // Update jwtData

                  // Use the newJwtData directly for login
                  loginWithJwt(newJwtData);
                })
                .catch((error) => {
                  Swal.fire("failed to refresh token!");
                });
            })
            .catch((error) => {
              Swal.fire({
                html: "<strong>Your login has expired. Kindly register again.</strong>",
                timer: 2000,
                showConfirmButton: false,
              });
            });
        })
        .catch((err) => {
          // Show validation errors
          Swal.fire(err.errors[0]);
        });
    } else {
      // JWT data is already available, use it directly for login
      loginWithJwt(jwtData);
    }
  };

  // const [updateUserNameValue, setUpdateUserNameValue] = useState("");
  // const handleOnChangeUpdateUserName = (e) => {
  //   setUpdateUserNameValue(e.target.value);
  // };

  const emailPopRegex = /^[^\s@]+@[^\s@]+\.(in|com)$/i;

  const findPopRoles = (value) => {
    // if (emailRegex.test(value)) {
    axios
      .get(`http://localhost:8080/findListOfRolesByUserName/${value}`)
      .then((res) => {
        const listData = res.data.map((i) => i.role);

        console.log(listData, "listData mmmmmmmmmmmmmmmmmmmmmmmm");

        if (listData?.length === 1) {
          setUserRolePop(listData?.join(""));
        } else {
          setStartSmartPopRole(listData);
        }
      })
      .catch(() => {
        Swal.fire({
          text: "Failed to fetch roles. Please enter a valid email.",
          icon: "error",
        });
      });
    // }
  };

  console.log(startSmartPopRole, "setStartSmartPopRole>>>>>>>>>>>>>>>>>>");

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  useEffect(() => {
    if (emailPopRegex.test(forgotPasswordEmail)) {
      findPopRoles(forgotPasswordEmail);
    }
  }, [forgotPasswordEmail]);

  const handleOnChangeUserName = (e) => {
    setForgotPasswordEmail(e.target.value);
    // setfindPopRoles(e.target.value);
  };

  const [updateOldPasswordValue, setUpdateOldPasswordValue] = useState("");
  const handleOnChangeUpdateOldPassword = (e) => {
    setUpdateOldPasswordValue(e.target.value);
  };

  const [updateNewPasswordValue, setUpdateNewPasswordValue] = useState("");
  const handleOnChangeUpdateNewPassword = (e) => {
    setUpdateNewPasswordValue(e.target.value);
  };

  console.log(updateNewPasswordValue, "updatePasswordValue");
  // const sendOtp = () => {
  //   axios
  //     .post(
  //       `http://localhost:8080/updatePassword?userName=${updateUserNameValue}&userOldPassword=${updateOldPasswordValue}&userNewPassword=${updateNewPasswordValue}`
  //     )
  //     .then((res) => {
  //       Swal.fire({
  //         title: "password updated successfully",
  //         icon: "success",
  //       });
  //       handleClose();
  //     })
  //     .catch((error) => {
  //       Swal.fire({
  //         title: "password not updated",
  //         text: "Please Verify username and password",
  //       });
  //       handleClose();
  //     });
  // };
  const [otpRequestStatus, setOtpRequestStatus] = useState("");
  const [emailOtp, setEmailOtp] = useSessionStorage("email_for_otp", "");

  console.log(otpRequestStatus, "otpRequestStatus");

  const sendOtp = () => {
    setOtpRequestStatus("initiated"); // Set the status to show the loading message
    console.log(userRolePop, "userRolePop 000000000000000");
    axios
      .post(
        `http://localhost:8080/cfl/generate-otp/${forgotPasswordEmail}/${userRolePop}`
      )
      .then((res) => {
        setOtpRequestStatus("success");
        setEmailOtp(forgotPasswordEmail);

        Swal.fire({
          html: "<strong>OTP sent successfully to your mail</strong>",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          width: "350px",
        });

        handleClose();
      })
      .catch((error) => {
        setOtpRequestStatus("error");
        Swal.fire({
          title: "Failed to sent OTP. Please try again",
          text: "Please verify your mail",
          timer: 2000,
          showConfirmButton: false,
          width: "350px",
        });

        handleClose();
      });
  };

  const [verifyOtp, setVerifyOtp] = useState("");
  const handleVerifyOtp = (e) => {
    setVerifyOtp(e.target.value);
  };

  // const [verifiedResponse,setVerifiedResponse]=useState(false);

  const verify = () => {
    axios
      .post(`http://localhost:8080/cfl/verify-otp/${emailOtp}/${verifyOtp}`)
      .then((res) => {
        setOtpRequestStatus("close");

        Swal.fire({
          html: "<strong>OTP verified successfully</strong>",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          width: "350px",
        });
      })
      .catch((error) => {
        Swal.fire({
          text: "OTP verification failed",
          width: "350px",
        });
      });
  };

  const [newPassword, setNewPassword] = useState("");
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const resetPassword = () => {
    axios
      .post(
        `http://localhost:8080/cfl/update-password/${forgotPasswordEmail}/${newPassword}`
      )
      .then((res) => {
        setOtpRequestStatus("closed");

        Swal.fire({
          html: "<strong>Password reset successfully</strong>",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          width: "350px",
        });
      })
      .catch((error) => {
        Swal.fire({
          text: "Password reset failed. Please try again !",
          width: "350px",
        });
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-200 flex-grow">
        {/* <div
        className="head flex items-center justify-between lg:px-10 pt-1"
        style={{ marginTop: "-4px" }}
      >
        <img
          src={CompanyLogo}
          className="w-[120px] h-[67px]  lg:w-[204px] lg:h-[80px] rounded-md"
        />
        <p className="text-blue-900 hidden lg:block lg:text-3xl text-center border-b-2 border-gray-600 text-gray-700 lg:w-[270px] font-semibold">
          Login to StartSmart
        </p>
        <img
          src={CflLogo}
          className="w-[120px] h-[100px] lg:w-[180px] lg:h-[120px]  rounded-md"
        />
      </div> */}
        <div
          className="head flex items-center justify-between lg:px-10 pt-3 mb-5 "
          style={{ marginTop: "-35px" }}
        >
          <img
            src={StartSmart}
            style={{
              width: "300px",
              height: "150px",
              marginLeft: "-30px",
              cursor: "pointer",
            }}
          />

          <p className="text-blue-900 hidden lg:block lg:text-3xl text-center border-b-2 border-gray-600 text-gray-700 lg:w-[270px] font-semibold">
            Login to StartSmart
          </p>
          <img
            src={CflLogo}
            className="w-[120px] h-[100px] lg:w-[180px] lg:h-[120px]  rounded-md"
          />
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ marginTop: "-65px", height: "544px" }}
        >
          <div className="flex justify-center">
            <div className="col-span-1 ">
              <Lottie
                loop={true}
                animationData={animationData}
                style={{
                  height: 450,
                  //width: 700,
                  marginTop: "40px",
                }}
              />
            </div>
          </div>
          <div className="flex justify-center  -mt-20 lg:-mt-0 lg:-ml-32">
            <div className="col-span-1 p-3 lg:p-2 lg:p-10 ">
              <div className="div border-[2px] border-gray-400 rounded-2xl p-5 w-[350px] lg:w-[500px] mt-32 lg:mt-10 bg-blue-100 shadow-xl ">
                <p className="text-3xl lg:text-2xl text-gray-700 ml-[75px] lg:ml-[170px] mb-7 lg:mb-3 font-semibold mt-5 lg:mt-0">
                  Login Here
                </p>
                <div className="email flex flex-col">
                  <label className="mb-1 text-gray-700 font-semibold text-2xl lg:text-lg">
                    Username
                  </label>

                  <div className="input flex items-center border-b-2 border-gray-400 p-1 rounded-sm text-gray-700 tracking-wide">
                    <FaUser className="lg:mx-2 text-xl text-md" />

                    <input
                      type="text"
                      placeholder="Enter CMS Email"
                      required
                      className="outline-none  bg-blue-100 w-[300px] lg:w-[380px] font-semibold tracking-wider ml-2 lg:ml-0 text-xl lg:text-md"
                      onChange={handleOnChange}
                      name="userName"
                    />
                  </div>

                  {startSmartRole?.length > 1 ? (
                    <div className="flex space-x-10 items-center mt-2">
                      <p className="text-lg font-semibold text-gray-600">
                        Select Roles
                      </p>
                      <Dropdown
                        options={options1}
                        onChange={handleSelect}
                        value={defaultOption1}
                        placeholder="Select an option"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {startSmartRole?.length > 1 ? (
                  <>
                    <div className="password flex flex-col  mt-10 lg:mt-0">
                      <label className="mb-1 text-gray-700 font-semibold text-2xl lg:text-lg">
                        Password
                      </label>
                      <div className="input flex items-center border-b-2 border-gray-400 p-1 rounded-sm text-gray-700 font-semibold tracking-wide">
                        <FaLock className="lg:mx-2 text-xl text-md" />
                        <input
                          type={eye ? "password" : "text"}
                          placeholder="Enter Password"
                          required
                          className="outline-none bg-blue-100  lg:w-[380px] lg:mr-5 tracking-wider ml-2 lg:ml-0 text-xl lg:text-md"
                          onChange={handleOnChange}
                          name="userPassword"
                        />
                        {eye ? (
                          <IoEye
                            className=" text-3xl lg:text-xl hover:cursor-pointer"
                            onClick={() => setEye(false)}
                          />
                        ) : (
                          <IoEyeOff
                            className=" text-3xl lg:text-xl hover:cursor-pointer"
                            onClick={() => setEye(true)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="update-password flex items-center space-x-5 mt-7 justify-center ">
                      <div
                        className="text-2xl lg:text-lg text-gray-700  hover:text-blue-900 hover:cursor-pointer font-semibold"
                        onClick={handleOpen}
                      >
                        Forgot Password
                      </div>
                      <div className="text-xl">
                        <FaUnlockKeyhole />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="loginBtn w-1/2  mt-4 mb-5">
                        <p
                          className="bg-blue-700 p-2 text-white rounded-xl text-center hover:bg-green-800 hover:cursor-pointer tracking-wide transition-transform hover:scale-110 text-xl lg:text-md"
                          onClick={handleLogin}
                        >
                          Login
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="password flex flex-col  mt-10 lg:mt-4">
                      <label className="mb-1 text-gray-700 font-semibold text-2xl lg:text-lg">
                        Password
                      </label>
                      <div className="input flex items-center border-b-2 border-gray-400 p-1 rounded-sm text-gray-700 font-semibold tracking-wide">
                        <FaLock className="lg:mx-2 text-xl text-md" />
                        <input
                          type={eye ? "password" : "text"}
                          placeholder="Enter Password"
                          required
                          className="outline-none bg-blue-100  lg:w-[380px] lg:mr-5 tracking-wider ml-2 lg:ml-0 text-xl lg:text-md"
                          onChange={handleOnChange}
                          name="userPassword"
                        />
                        {eye ? (
                          <IoEye
                            className=" text-3xl lg:text-xl hover:cursor-pointer"
                            onClick={() => setEye(false)}
                          />
                        ) : (
                          <IoEyeOff
                            className=" text-3xl lg:text-xl hover:cursor-pointer"
                            onClick={() => setEye(true)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="update-password flex items-center space-x-5 mt-7 justify-center ">
                      <div
                        className="text-2xl lg:text-lg text-gray-700  hover:text-blue-900 hover:cursor-pointer font-semibold"
                        onClick={handleOpen}
                      >
                        Forgot Password
                      </div>
                      <div className="text-xl">
                        <FaUnlockKeyhole />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="loginBtn w-1/2  mt-4 mb-5">
                        <p
                          className="bg-blue-700 p-2 text-white rounded-xl text-center hover:bg-green-800 hover:cursor-pointer tracking-wide transition-transform hover:scale-110 text-xl lg:text-md"
                          onClick={handleLogin}
                        >
                          Login
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="modal">
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                      <div className="div">
                        <p className="text-2xl text-center mb-2 font-bold">
                          Forgot Your Password ?
                        </p>

                        <div className="matrix mt-10 px-10">
                          <div className="feedback">
                            <div className="username">
                              <div className="title">
                                <p className="font-bold">Your Email</p>
                              </div>

                              <div className="input">
                                <input
                                  type="text"
                                  className="border-2 border-gray-500 w-[300px] rounded-md p-2 text-md outline-none text-center"
                                  name="userName"
                                  onChange={handleOnChangeUserName}
                                />
                              </div>
                            </div>
                          </div>

                          {startSmartPopRole?.length > 1 ? (
                            <div className="flex space-x-10 items-center mt-2">
                              <p className="text-lg font-semibold text-gray-600">
                                Select Roles
                              </p>
                              <Dropdown
                                options={options2}
                                onChange={handleSelectPop}
                                value={defaultOption2}
                                placeholder="Select an option"
                              />
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="flex justify-center mt-5">
                            {otpRequestStatus === "initiated" ? (
                              <p>
                                OTP generation request has been initiated...
                              </p>
                            ) : (
                              <button
                                className="p-3 bg-blue-800 text-white rounded-md px-5 hover:bg-pink-600"
                                onClick={sendOtp}
                              >
                                Send OTP
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Box>
                  </Modal>
                </div>

                {otpRequestStatus === "success" ? (
                  <div className="absolute top-[30vh] left-[20vw] lg:left-[40vw] bg-blue-900 p-5 rounded-md z-50">
                    <div className="input flex flex-col">
                      <label className="text-center text-white">
                        Enter Otp
                      </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border border-gray-400 outline-none"
                        onChange={handleVerifyOtp}
                      />
                    </div>

                    <div className="flex justify-center mt-5 ">
                      <div
                        className="button p-2 bg-yellow-600 text-white w-1/2 rounded-md text-center tracking-wide hover:cursor-pointer"
                        onClick={verify}
                      >
                        verify
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {otpRequestStatus === "close" ? (
                  <div className="absolute top-[30vh] left-[20vw] lg:left-[40vw] bg-blue-900 p-5 rounded-md z-50">
                    <div className="input flex flex-col">
                      <label className="text-center text-white">
                        Enter New Password
                      </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border border-gray-400 outline-none"
                        onChange={handleNewPassword}
                      />
                    </div>

                    <div className="flex justify-center mt-5 ">
                      <div
                        className="button p-2 bg-yellow-600 text-white w-1/2 rounded-md text-center tracking-wide hover:cursor-pointer"
                        onClick={resetPassword}
                      >
                        Reset
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="div flex items-center space-x-5 flex justify-center ">
                  <div>
                    <a
                      href="https://www.facebook.com/cmscomputerslimited/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="text-2xl text-blue-700" />
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://x.com/cmscomputersIND"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaSquareXTwitter className="text-2xl text-black" />
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://www.linkedin.com/company/cms-computers-limited-india-?trk=nmp_rec_act_company_name"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-2xl text-blue-800" />
                    </a>
                  </div>

                  <div>
                    <a
                      href=" https://www.youtube.com/user/cmscomputers2014"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IoLogoYoutube className="text-2xl text-red-700" />
                    </a>
                  </div>
                </div>

                {/* <div className="signup text-center">
              Not a Member ?
              <Link
                to="/signup"
                className="text-blue-700 text-xl font-semibold ml-2"
              >
                Sign up
              </Link>
            </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 justify-center -mt-14">
          <p className="font-bold">Powered by </p>
          <img src={CompanyLogo} className="w-[100px] h-[30px]" />
        </div>
      </div>
    </div>
  );
}

export default Login;
