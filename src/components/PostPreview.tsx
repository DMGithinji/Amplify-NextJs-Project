import { ButtonBase, Grid, Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { Post } from "../API";
import { useRouter } from "next/router";
import { useUser } from "../context/AuthContext";

interface Props {
  post: Post;
}

export default function PostPreview({ post }: Props): ReactElement {
  const router = useRouter();
  const { user } = useUser();

  console.log(post);

  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{ padding: 12, marginTop: 24 }}
      >
        {/* Content Preview */}
        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by <b>{post.owner}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post.title}</Typography>
              </Grid>
              <Grid
                item
                style={{
                  maxHeight: 32,
                  overflowY: "hidden",
                  overflowX: "hidden",
                }}
              ></Grid>
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}
