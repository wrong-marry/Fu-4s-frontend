import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  Text,
  Center,
  Badge,
  Group,
} from "@mantine/core";

const SubjectCounter: React.FC = () => {
  const [allSubject, setAllSubject] = useState(0);
  const [activeSubject, setActiveSubject] = useState(0);
  const [disabledSubject, setDisabledSubject] = useState(0);

  useEffect(() => {
    const fetchAllSubject = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/admin/getNumSubject`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAllSubject(data);
      } catch (error) {
        console.error("Error fetching all subjects:", error);
      }
    };

    const fetchActiveSubject = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/admin/getNumSubjectsByType?isActive=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setActiveSubject(data);
      } catch (error) {
        console.error("Error fetching active subjects:", error);
      }
    };

    const fetchDisabledSubject = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/admin/getNumSubjectsByType?isActive=false`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setDisabledSubject(data);
      } catch (error) {
        console.error("Error fetching disabled subjects:", error);
      }
    };

    fetchAllSubject();
    fetchActiveSubject();
    fetchDisabledSubject();
  }, []);
  return (
    <>
      <section>
        <div className="container px-4 mx-auto">
          <div>
            <h3 className="text-xl font-bold w-full w-auto p-5">
              SUBJECT STATISTICS
            </h3>
          </div>
          <div className="flex flex-wrap -m-3">
            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
              <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                  <div className="w-auto p-2">
                    <h3 className="text-sm text-coolGray-500 font-medium">
                      Active Subjects
                    </h3>
                  </div>
                </div>
                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                  {activeSubject}
                </h2>
                <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full mt-2">
                  Active
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
              <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                  <div className="w-auto p-2">
                    <h3 className="text-center text-sm text-coolGray-500 font-medium">
                      Disabled Subjects
                    </h3>
                  </div>
                </div>
                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                  {disabledSubject}
                </h2>
                <p className="text-center max-w-max mx-auto px-2 py-1 text-red-500 font-medium text-xs bg-red-100 rounded-full mt-2">
                  Disabled
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
              <div className="p-6 pb-10 border border-coolGray-100 rounded-md shadow-dashboard">
                <div className="flex flex-wrap items-end justify-center -m-2 mb-3">
                  <div className="w-auto p-2">
                    <h3 className="text-sm text-coolGray-500 font-medium">
                      All Subjects
                    </h3>
                  </div>
                </div>
                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                  {allSubject}
                </h2>
                <p className="text-center max-w-max mx-auto px-2 py-1 text-yellow-500 font-medium text-xs bg-yellow-100 rounded-full mt-2">
                  All
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SubjectCounter;
