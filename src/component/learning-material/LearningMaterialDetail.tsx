import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@mui/material/styles";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

interface LearningMaterial {
  id: string;
  title: string;
  username: string;
  content: string;
  attempts: number;
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 800,
    margin: "0 auto",
    padding: theme.spacing(4),
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  title: {
    fontWeight: "bold",
  },
  metadata: {
    color: "#666",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  content: {
    lineHeight: 1.6,
    fontSize: 16,
  },
}));

const LearningMaterialDetail: React.FC = () => {
  //   const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [learningMaterial, setLearningMaterial] =
    useState<LearningMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParameter] = useSearchParams();
  const idParam = queryParameter.get("id");
  const api = "http://localhost:8080/api/v1/learningMaterial?id=" + idParam;
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(api);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLearningMaterial(data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!learningMaterial) {
    return <div>No learning material found</div>;
  }

  return (
    <Box>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src="https://via.placeholder.com/40"
              alt={learningMaterial.username}
            />
          }
          title={<Typography>{learningMaterial.title}</Typography>}
          subheader={
            <Typography>
              By {learningMaterial.username} | {learningMaterial.attempts}{" "}
              attempts
            </Typography>
          }
        />
        <CardContent>{learningMaterial.content}</CardContent>
      </Card>
    </Box>
  );
};

export default LearningMaterialDetail;
