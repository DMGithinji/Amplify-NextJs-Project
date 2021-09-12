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
  password: string;
}

export default function Signup() {
  const { user } = useUser();
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");
  const [openSnackbar, setOpenSnackBar] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await Auth.signIn(data.username, data.password);
      router.push("/");
    } catch (err) {
      console.error(err);
      setSignInError(err.message);
      setOpenSnackBar(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  console.log("The value of the user from the hook is:", user);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container direction="column" alignItems="center" justifyContent="center" spacing={3}>
        <Grid item>
          <TextField
            name="username"
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

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            Sign in
          </Button>
        </Grid>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {signInError}
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
}
