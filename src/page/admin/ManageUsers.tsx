import { useState } from "react";

import DashboardSection from "../../component/manageUser/manage-user/show-customer.tsx";
import TableUser from "../../component/manageUser/manage-user/TableUser";
export default function ManageUsers() {
    
  const [flag2, setFlag2] = useState(false);
  return (
    <>
      <DashboardSection flag2={flag2} setFlag2={setFlag2} />
      <TableUser flag2={flag2} setFlag2={setFlag2} />
    </>
  );
}

