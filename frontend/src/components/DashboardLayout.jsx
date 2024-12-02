import React from "react";
import SideBar from "./SideBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="grid lg:grid-cols-[350px,1fr] h-screen max-h-screen">
      <section>
        <SideBar />
      </section>
      {children}
    </div>
  );
};

export default DashboardLayout;
