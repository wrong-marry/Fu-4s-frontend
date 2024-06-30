import {Card} from '@mantine/core';
import {useEffect, useState} from 'react';


const DashboardSection: React.FC = () => {
    const [, setNumOfUser] = useState(0);
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
                setNumOfAccount(data)
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
    }, [])

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
                            <Card radius="md" shadow='md'>

                                <h3 className="text-sm text-coolGray-500 font-medium">
                                    Number of Users
                                </h3>


                                <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
                                    web users
                                </p>
                            </Card>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <div className="p-6 pb-10 bg-white border border-coolGray-100 rounded-md shadow-dashboard">
                                <div className="flex flex-wrap items-end justify-between -m-2 mb-7">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            Number of Staffs
                                        </h3>
                                    </div>
                                    <div className="w-auto p-2">
                                        <a href="#">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8 6.66666C7.73629 6.66666 7.47851 6.74486 7.25924 6.89137C7.03998 7.03788 6.86908 7.24612 6.76816 7.48975C6.66724 7.73339 6.64084 8.00148 6.69229 8.26012C6.74373 8.51876 6.87072 8.75634 7.05719 8.94281C7.24366 9.12928 7.48124 9.25626 7.73988 9.30771C7.99852 9.35916 8.26661 9.33275 8.51025 9.23184C8.75388 9.13092 8.96212 8.96002 9.10863 8.74076C9.25514 8.52149 9.33333 8.26371 9.33333 8C9.33333 7.64638 9.19286 7.30724 8.94281 7.05719C8.69276 6.80714 8.35362 6.66666 8 6.66666ZM3.33333 6.66666C3.06963 6.66666 2.81184 6.74486 2.59257 6.89137C2.37331 7.03788 2.20241 7.24612 2.10149 7.48975C2.00058 7.73339 1.97417 8.00148 2.02562 8.26012C2.07707 8.51876 2.20405 8.75634 2.39052 8.94281C2.57699 9.12928 2.81457 9.25626 3.07321 9.30771C3.33185 9.35916 3.59994 9.33275 3.84358 9.23184C4.08721 9.13092 4.29545 8.96002 4.44196 8.74076C4.58847 8.52149 4.66667 8.26371 4.66667 8C4.66667 7.64638 4.52619 7.30724 4.27614 7.05719C4.02609 6.80714 3.68696 6.66666 3.33333 6.66666ZM12.6667 6.66666C12.403 6.66666 12.1452 6.74486 11.9259 6.89137C11.7066 7.03788 11.5357 7.24612 11.4348 7.48975C11.3339 7.73339 11.3075 8.00148 11.359 8.26012C11.4104 8.51876 11.5374 8.75634 11.7239 8.94281C11.9103 9.12928 12.1479 9.25626 12.4065 9.30771C12.6652 9.35916 12.9333 9.33275 13.1769 9.23184C13.4205 9.13092 13.6288 8.96002 13.7753 8.74076C13.9218 8.52149 14 8.26371 14 8C14 7.64638 13.8595 7.30724 13.6095 7.05719C13.3594 6.80714 13.0203 6.66666 12.6667 6.66666Z"
                                                    fill="#D5DAE1"
                                                ></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                    {numOfStaff}
                                </h2>
                                <p className="text-center max-w-max mx-auto px-2 py-1 text-red-500 font-medium text-xs bg-red-100 rounded-full">
                                    staffs
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <div className="p-6 pb-10 bg-white border border-coolGray-100 rounded-md shadow-dashboard">
                                <div className="flex flex-wrap items-end justify-between -m-2 mb-7">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            Number of Admins
                                        </h3>
                                    </div>
                                    <div className="w-auto p-2">
                                        <a href="#">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8 6.66666C7.73629 6.66666 7.47851 6.74486 7.25924 6.89137C7.03998 7.03788 6.86908 7.24612 6.76816 7.48975C6.66724 7.73339 6.64084 8.00148 6.69229 8.26012C6.74373 8.51876 6.87072 8.75634 7.05719 8.94281C7.24366 9.12928 7.48124 9.25626 7.73988 9.30771C7.99852 9.35916 8.26661 9.33275 8.51025 9.23184C8.75388 9.13092 8.96212 8.96002 9.10863 8.74076C9.25514 8.52149 9.33333 8.26371 9.33333 8C9.33333 7.64638 9.19286 7.30724 8.94281 7.05719C8.69276 6.80714 8.35362 6.66666 8 6.66666ZM3.33333 6.66666C3.06963 6.66666 2.81184 6.74486 2.59257 6.89137C2.37331 7.03788 2.20241 7.24612 2.10149 7.48975C2.00058 7.73339 1.97417 8.00148 2.02562 8.26012C2.07707 8.51876 2.20405 8.75634 2.39052 8.94281C2.57699 9.12928 2.81457 9.25626 3.07321 9.30771C3.33185 9.35916 3.59994 9.33275 3.84358 9.23184C4.08721 9.13092 4.29545 8.96002 4.44196 8.74076C4.58847 8.52149 4.66667 8.26371 4.66667 8C4.66667 7.64638 4.52619 7.30724 4.27614 7.05719C4.02609 6.80714 3.68696 6.66666 3.33333 6.66666ZM12.6667 6.66666C12.403 6.66666 12.1452 6.74486 11.9259 6.89137C11.7066 7.03788 11.5357 7.24612 11.4348 7.48975C11.3339 7.73339 11.3075 8.00148 11.359 8.26012C11.4104 8.51876 11.5374 8.75634 11.7239 8.94281C11.9103 9.12928 12.1479 9.25626 12.4065 9.30771C12.6652 9.35916 12.9333 9.33275 13.1769 9.23184C13.4205 9.13092 13.6288 8.96002 13.7753 8.74076C13.9218 8.52149 14 8.26371 14 8C14 7.64638 13.8595 7.30724 13.6095 7.05719C13.3594 6.80714 13.0203 6.66666 12.6667 6.66666Z"
                                                    fill="#D5DAE1"
                                                ></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                    {numOfAdmin}
                                </h2>
                                <p className="text-center max-w-max mx-auto px-2 py-1 text-yellow-500 font-medium text-xs bg-yellow-100 rounded-full">
                                    admins
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/4 p-3">
                            <div className="p-6 pb-10 bg-white border border-coolGray-100 rounded-md shadow-dashboard">
                                <div className="flex flex-wrap items-end justify-between -m-2 mb-7">
                                    <div className="w-auto p-2">
                                        <h3 className="text-sm text-coolGray-500 font-medium">
                                            ALL
                                        </h3>
                                    </div>
                                    <div className="w-auto p-2">
                                        <a href="#">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8 6.66666C7.73629 6.66666 7.47851 6.74486 7.25924 6.89137C7.03998 7.03788 6.86908 7.24612 6.76816 7.48975C6.66724 7.73339 6.64084 8.00148 6.69229 8.26012C6.74373 8.51876 6.87072 8.75634 7.05719 8.94281C7.24366 9.12928 7.48124 9.25626 7.73988 9.30771C7.99852 9.35916 8.26661 9.33275 8.51025 9.23184C8.75388 9.13092 8.96212 8.96002 9.10863 8.74076C9.25514 8.52149 9.33333 8.26371 9.33333 8C9.33333 7.64638 9.19286 7.30724 8.94281 7.05719C8.69276 6.80714 8.35362 6.66666 8 6.66666ZM3.33333 6.66666C3.06963 6.66666 2.81184 6.74486 2.59257 6.89137C2.37331 7.03788 2.20241 7.24612 2.10149 7.48975C2.00058 7.73339 1.97417 8.00148 2.02562 8.26012C2.07707 8.51876 2.20405 8.75634 2.39052 8.94281C2.57699 9.12928 2.81457 9.25626 3.07321 9.30771C3.33185 9.35916 3.59994 9.33275 3.84358 9.23184C4.08721 9.13092 4.29545 8.96002 4.44196 8.74076C4.58847 8.52149 4.66667 8.26371 4.66667 8C4.66667 7.64638 4.52619 7.30724 4.27614 7.05719C4.02609 6.80714 3.68696 6.66666 3.33333 6.66666ZM12.6667 6.66666C12.403 6.66666 12.1452 6.74486 11.9259 6.89137C11.7066 7.03788 11.5357 7.24612 11.4348 7.48975C11.3339 7.73339 11.3075 8.00148 11.359 8.26012C11.4104 8.51876 11.5374 8.75634 11.7239 8.94281C11.9103 9.12928 12.1479 9.25626 12.4065 9.30771C12.6652 9.35916 12.9333 9.33275 13.1769 9.23184C13.4205 9.13092 13.6288 8.96002 13.7753 8.74076C13.9218 8.52149 14 8.26371 14 8C14 7.64638 13.8595 7.30724 13.6095 7.05719C13.3594 6.80714 13.0203 6.66666 12.6667 6.66666Z"
                                                    fill="#D5DAE1"
                                                ></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <h2 className="text-center font-medium text-5xl text-coolGray-900 tracking-tighter">
                                    {numOfAccount}
                                </h2>
                                <p className="text-center max-w-max mx-auto px-2 py-1 text-green-500 font-medium text-xs bg-green-100 rounded-full">
                                    all users
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashboardSection;