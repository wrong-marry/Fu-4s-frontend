import {Card} from "@mantine/core";
import {useEffect, useState} from "react";

const DashboardSection: React.FC = () => {
    const [numOfUser, setNumOfUser] = useState(0);
    const [numOfAccount, setNumOfAccount] = useState(0);
    const [numOfStaff, setNumOfStaff] = useState(0);
    const [numOfAdmin, setNumOfAdmin] = useState(0);
    useEffect(() => {
        const fetchNumOfUser = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://3.27.235.175:8080/api/v1/admin/getNumUser`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setNumOfAccount(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        const fetchNumOfAdminRole = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://3.27.235.175:8080/api/v1/admin/getNumEachRole?userrole=ADMIN`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setNumOfAdmin(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        const fetchNumOfStaffRole = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://3.27.235.175:8080/api/v1/admin/getNumEachRole?userrole=STAFF`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setNumOfStaff(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        const fetchNumOfUserRole = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://3.27.235.175:8080/api/v1/admin/getNumEachRole?userrole=USER`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setNumOfUser(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchNumOfAdminRole();
        fetchNumOfStaffRole();
        fetchNumOfUserRole();
        fetchNumOfUser();
    }, []);

    return (
        <>
            <section className="bg-coolGray-50 py-4">
                <div className="container px-4 mx-auto">
                    <div className="bg-coolGray-50 py-4">
                        <h3 className="text-xl font-bold w-full w-auto p-5">
                            QUANTITY STATISTICS
                        </h3>
                    </div>
                    <div className="flex flex-wrap -m-3">

                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <Card withBorder radius="lg" shadow="md">
                                <div className="flex flex-wrap items-end justify-between">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            Number of Users
                                        </h3>
                                    </div>
                                </div>
                                <div className="my-7">
                                    <h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
                                        {numOfUser}
                                    </h2>
                                    <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
                                        web users
                                    </p>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <Card withBorder radius="lg" shadow="md">
                                <div className="flex flex-wrap items-end justify-between">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            Number of Staffs
                                        </h3>
                                    </div>
                                </div>
                                <div className="my-7">
                                    <h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
                                        {numOfStaff}
                                    </h2>
                                    <p className="text-center max-w-max mx-auto px-2 py-1 text-red-500 font-medium text-xs bg-red-100 rounded-full">
                                        staffs
                                    </p>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <Card withBorder radius="lg" shadow="md">
                                <div className="flex flex-wrap items-end justify-between">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            Number of Admins
                                        </h3>
                                    </div>
                                </div>
                                <div className="my-7">
                                    <h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
                                        {numOfAdmin}
                                    </h2>
                                    <p className="text-center max-w-max mx-auto px-2 py-1 text-yellow-500 font-medium text-xs bg-yellow-100 rounded-full">
                                        admins
                                    </p>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <Card withBorder radius="lg" shadow="md">
                                <div className="flex flex-wrap items-end justify-between">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            ALL
                                        </h3>
                                    </div>
                                </div>
                                <div className="my-7">
                                    <h2 className="text-center mb-2 font-medium text-5xl text-coolGray-900 tracking-tighter">
                                        {numOfAccount}
                                    </h2>
                                    <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
                                        all users
                                    </p>
                                </div>
                            </Card>
                        </div>


                    </div>
                </div>
            </section>
        </>
    );
};

export default DashboardSection;
