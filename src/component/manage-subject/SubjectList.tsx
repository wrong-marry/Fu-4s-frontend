import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useParams } from "react-router-dom";
import { TableCell, Typography } from "@mui/material";

// Định nghĩa interface cho Subject
interface Subject {
  code: string;
  name: string;
  semester: number;
}

function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/subject/getAll`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Subject[] = await response.json();
        setSubjects(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã môn học</TableCell>
              <TableCell>Tên môn học</TableCell>
              <TableCell>Học kỳ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow
                key={index}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/subjects/${subject.code}`)}
              >
                <TableCell>
                  <Typography variant="body1">{subject.code}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{subject.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{subject.semester}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default SubjectList;
