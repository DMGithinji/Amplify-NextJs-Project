import { Box, ButtonBase, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import Image from "next/image";

import { Post } from "../API";
import { useRouter } from "next/router";
import { useUser } from "../context/AuthContext";

import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";

import formatDatePosted from "../lib/formatDatePosted";

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
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={2}
        style={{ padding: "15px 30px", marginTop: 24 }}
      >
        {/* Content Preview */}
        <Grid item style={{ padding: "0 10px" }}>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Typography variant="h2">{post.title}</Typography>
            </Grid>
          </ButtonBase>
        </Grid>

        {/* Image */}
        {post.image && (
          <Grid item>
            <Image src={"/vercel.svg"} height={150} width={380} layout="intrinsic" />
          </Grid>
        )}

        <Grid item>
          <Typography variant="body1">{post.content}</Typography>
        </Grid>

        <Grid container direction="row" justifyContent="space-between" alignItems="center" wrap="nowrap">
          {/* Metadata */}
          <Grid container justifyContent="flex-start" style={{ padding: "0 10px" }}>
            <Typography variant="body1">
              by <b>{post.owner}</b>, {formatDatePosted(post.createdAt)} hours ago
            </Typography>
          </Grid>

          {/* Upvote / votes / downvote */}
          <Grid container justifyContent="flex-end">
            <Box display="flex" alignItems="center" style={{ paddingRight: "20px" }}>
              <IconButton color="inherit" style={{ padding: "20px" }}>
                <ThumbUp />
              </IconButton>
              <Typography variant="h6">{post.upvotes}</Typography>
            </Box>
            <Box display="flex" alignItems="center" style={{ paddingRight: "20px" }}>
              <IconButton color="inherit" style={{ padding: "20px" }}>
                <ThumbDown />
              </IconButton>
              <Typography variant="h6">{post.downvotes}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
