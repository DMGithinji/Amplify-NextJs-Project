import React, { ReactElement, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { API, Storage } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";

import { createPost } from "../graphql/mutations";
import { CreatePostInput, CreatePostMutation } from "../API";
import ImageDropzone from "../components/ImageDropzone";

interface IFormInput {
  title: string;
  content: string;
}

interface Props {}

export default function Create({}: Props): ReactElement {
  const router = useRouter();
  const [file, setFile] = useState<File>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    console.log(file);

    let createNewPostInput: CreatePostInput = {
      title: data.title,
      content: data.content,
    };

    if (file) {
      // Send a request to upload to the S3 Bucket.
      const imagePath = uuidv4();

      try {
        await Storage.put(imagePath, file, {
          contentType: file.type, // contentType is optional
        });

        createNewPostInput.image = imagePath;
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }

    const createNewPost = (await API.graphql({
      query: createPost,
      variables: { input: createNewPostInput },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    })) as { data: CreatePostMutation };

    console.log("New post created successfully:", createNewPost);

    router.push(`/post/${createNewPost.data.createPost.id}`);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Paper elevation={3} style={{ padding: 30 }}>
        <Typography variant="h4" color="textSecondary" style={{ marginBottom: 40 }}>
          Post Your Opinions
        </Typography>

        {/* Create a form where: */}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container spacing={4} direction="column">
            {/* Title of the post */}
            <Grid item>
              <TextField
                variant="outlined"
                id="title"
                label="What is your opinion about?"
                type="text"
                fullWidth
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title.message : null}
                {...register("title", {
                  required: { value: true, message: "Please enter a title." },
                  maxLength: {
                    value: 120,
                    message: "Please enter an opinion title that is 120 characters or less.",
                  },
                })}
              />
            </Grid>

            {/* Contents of the post */}
            <Grid item>
              <TextField
                variant="outlined"
                id="content"
                label="What is your opinion?"
                type="text"
                fullWidth
                minRows={8}
                multiline
                error={errors.content ? true : false}
                helperText={errors.content ? errors.content.message : null}
                {...register("content", {
                  required: {
                    value: true,
                    message: "Please enter some content for your opinion.",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Please make sure your content is 1000 characters or less.",
                  },
                })}
              />
            </Grid>

            {/* Optional Image of the post */}
            <Grid item>
              <ImageDropzone file={file} setFile={setFile} />
            </Grid>

            {/* Button to submit the form with those contents */}
            <Grid item style={{ marginTop: 14 }}>
              <Button variant="contained" color="primary" type="submit">
                Create Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
