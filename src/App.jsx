import { useState } from "react";
import { App as AntApp, ConfigProvider } from "antd";

import DashboardLayout from "./layouts/DashboardLayout";
import { darkTheme, lightTheme } from "./theme/appTheme";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("cluster-manager-theme") === "dark";
  });

  const handleThemeChange = (checked) => {
    setDarkMode(checked);

    localStorage.setItem("cluster-manager-theme", checked ? "dark" : "light");
  };

  return (
    <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
      <AntApp>
        <DashboardLayout
          darkMode={darkMode}
          onThemeChange={handleThemeChange}
        />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
