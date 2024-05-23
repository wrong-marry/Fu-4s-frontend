import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";

interface LearningMaterial {
  id: string;
  title: string;
  link: string;
  attempts: number;
  username: string;
  postTime: string;
}

function LearningMaterialList() {
  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterial[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/learningMaterial/getAll"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LearningMaterial[] = await response.json();
        console.log(data);
        setLearningMaterials(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRowClick = (link: string) => {
    navigate(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLearningMaterialClick = (id: string) => {
    navigate(`/learningMaterial/${id}`);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Posting Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningMaterials.map((learningMaterial, index) => (
              <TableRow>
                <TableCell
                  key={index}
                  onClick={() =>
                    handleLearningMaterialClick(learningMaterial.id)
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {learningMaterial.title}
                </TableCell>
                <TableCell>{learningMaterial.username}</TableCell>
                <TableCell>{learningMaterial.postTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default LearningMaterialList;
