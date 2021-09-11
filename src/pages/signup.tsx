import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

import { TextField, Button, Snackbar, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { useUser } from "../context/AuthContext";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const { user } = useUser();
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCodeInput) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCodeInput(true);
      }
    } catch (err) {
      console.error(err);
      setSignUpError(err.message);
      setOpenSnackBar(true);
    }
  };

  async function signUpWithEmailAndPassword(data: IFormInput): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, code } = data;
    try {
      const amplifyUser = await Auth.confirmSignUp(username, code);
      console.log("Successs, singed in a user", amplifyUser);
      if (amplifyUser) {
        router.push(`/`);
      } else {
        throw new Error("Something went wrong :'(");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  console.log("The value of the user from the hook is:", user);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="column" alignItems="center" justifyContent="center" spacing={3}>
        <Grid item>
          <TextField
            name="email"
            variant="outlined"
            id="username"
            label="Username"
            type="text"
            error={errors.username ? true : false}
            helperText={errors.username ? errors.username.message : null}
            {...register("username", {
              required: { value: true, message: "Please enter a username." },
              minLength: {
                value: 3,
                message: "Please enter a username between 3-16 characters.",
              },
              maxLength: {
                value: 16,
                message: "Please enter a username between 3-16 characters.",
              },
            })}
          />
        </Grid>

        <Grid item>
          <TextField
            variant="outlined"
            id="email"
            label="Email"
            type="email"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            {...register("email", {
              required: { value: true, message: "Please enter a valid email." },
            })}
          />
        </Grid>

        <Grid item>
          <TextField
            variant="outlined"
            id="password"
            label="Password"
            type="password"
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : null}
            {...register("password", {
              required: { value: true, message: "Please enter a password." },
              minLength: {
                value: 8,
                message: "Please enter a stronger password.",
              },
            })}
          />
        </Grid>

        {showCodeInput && (
          <Grid item>
            <TextField
              variant="outlined"
              id="code"
              label="Verification Code"
              type="text"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register("code", {
                required: { value: true, message: "Please enter a code." },
                minLength: {
                  value: 6,
                  message: "Your verification is 6 characters long.",
                },
                maxLength: {
                  value: 6,
                  message: "Your verification is 6 characters long.",
                },
              })}
            />
          </Grid>
        )}

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            Sign up
          </Button>
        </Grid>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {signUpError}
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
}
