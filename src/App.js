import React, { useRef, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Fieldset } from "primereact/fieldset";

import {
  WbSunny,
  Cloud,
  AcUnit,
  Air,
  Water,
  BeachAccess,
  Opacity,
  Thunderstorm,
  WbIncandescentOutlined,
  CloudDone,
} from "@mui/icons-material";

export default function App() {
  const toast = useRef(null);
  // Form state and validation
  const [IPAddress, setIPAddress] = useState("");
  const [isIPAddressSet, setIsIPAddressSet] = useState(false);
  const [isValidIP, setIsValidIP] = useState(true);

  // IP API
  const [IPObject, setIPObject] = useState(null);
  // Location API

  // Weather API

  useEffect(() => {
    // Everytime a new IP adress is entered
    // Either by user or by the Get Server IP button
    // This function triggers to check if it's in the correct format
    if (isIPAddressSet) {
      // Call your validation function here
      handleValidateIp();
    }
  }, [isIPAddressSet]);
  const handleInputChange = (e) => {
    setIPAddress(e.target.value);
  };

  const handleValidateIp = () => {
    // IPV4 Regex
    // ^ and $ are anchors that match the beginning and end of a sequence
    // (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) is a group that matches one of three possibilities:
    // 25[0-5]: This part matches numbers from 250 to 255.
    // 2[0-4][0-9]: This part matches numbers from 200 to 249.
    // [01]?[0-9][0-9]?: This part matches numbers from 0 to 199. [01]? allows for an optional leading 0 or 1, and [0-9][0-9]? matches one or two additional digits.
    // "\." matches the period character which separates the four groups of numbers
    // The number pattern repeats 4 times, resulting in a valid IPV4 address.
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // Check if the input matches the IP address pattern
    setIsValidIP(ipRegex.test(IPAddress));
  };

  const showToast = (message, type) => {
    switch (type) {
      case "success":
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: message,
          life: 3000,
        });
        break;
      case "info":
        toast.current.show({
          severity: "info",
          summary: "Info",
          detail: message,
          life: 3000,
        });
        break;
      case "warn":
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: message,
          life: 3000,
        });
        break;
      case "error":
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: message,
          life: 3000,
        });
        break;
      default:
        break;
    }
  };

  const getServerIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
        showToast(
          "The API you are requesting from is not working properly at the moment",
          "error"
        );
      }

      const data = await response.json();
      const { ip } = data;
      console.log(`Server IP is ${ip}`);
      setIPAddress(ip);
      setIsIPAddressSet(true);
      return ip;
    } catch (error) {
      showToast("Error fetching IP address", "error");
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  // IP Info
  const fetchIpInfo = () => {
    // Define the callback function to handle the JSONP response
    const handleJsonpResponse = (data) => {
      setIPObject(data);
    };

    // Create a script element and append it to the document
    const script = document.createElement("script");
    script.src = `https://ipapi.co/${IPAddress}/jsonp/?callback=getIPInformation`;
    script.async = true;
    script.addEventListener("load", () => {
      // Remove the script element after the JSONP response is loaded
      document.body.removeChild(script);
    });
    document.body.appendChild(script);
  };
  // Callback function for the jsonp data
  window.getIPInformation = (data) => {
    // Log all data to the console
    console.log("JSONP Response Data:", data);

    // Set the ipObject state with the received data
    setIPObject(data);
  };

  return (
    <>
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
        <div className="flex flex-wrap gap-2"></div>
      </div>

      <Fieldset legend="IP Address" toggleable>
        <div>
          <span className="p-float-label">
            <InputText
              id="ipInput"
              type="text"
              value={IPAddress}
              onChange={handleInputChange}
              className={!isValidIP ? "p-invalid" : ""}
            />
            <label htmlFor="ipInput">Enter a valid IPV4 address</label>
          </span>
          {!isValidIP && (
            <small style={{ color: "red" }}>Invalid IPV4 address format</small>
          )}
        </div>
        <div className="row">
          <Button
            label="Confirm IP"
            className="p-button-info"
            onClick={handleValidateIp}
          />
          <Button
            label="Get Server IP"
            className="p-button-success"
            onClick={getServerIP}
          />
          <Button
            label="Get IP information"
            className="p-button-success"
            onClick={fetchIpInfo}
          />
        </div>
        {IPObject !== null ? (
          <div>
            <p>
              You are located in{" "}
              <strong>
                {IPObject.city}, {IPObject.region}, {IPObject.country_name}
              </strong>{" "}
              ({IPObject.country_code}). Your IP address is{" "}
              <strong>{IPObject.ip}</strong>, and it belongs to the{" "}
              <strong>{IPObject.network}</strong> network.
            </p>
            <p>
              Your geographical coordinates are approximately{" "}
              <strong>
                {IPObject.latitude}° N, {IPObject.longitude}° W
              </strong>
              . You are in the <strong>{IPObject.timezone}</strong> timezone
              (UTC {IPObject.utc_offset}), and the postal code for your area is{" "}
              <strong>{IPObject.postal}</strong>.
            </p>
            <p>
              The country calling code is{" "}
              <strong>{IPObject.country_calling_code}</strong>, and the country
              area covers approximately{" "}
              <strong>{IPObject.country_area} square kilometers</strong> with a
              population of <strong>{IPObject.country_population}</strong>{" "}
              people. The official currency is the{" "}
              <strong>
                {IPObject.currency_name} ({IPObject.currency})
              </strong>
              .
            </p>
            <p>
              Languages spoken in your region include{" "}
              <strong>{IPObject.languages}</strong>, and you are part of the{" "}
              <strong>{IPObject.continent_code}</strong> continent. Your IP
              belongs to the Autonomous System Number (ASN){" "}
              <strong>{IPObject.asn}</strong>, which is associated with{" "}
              <strong>{IPObject.org}</strong>.
            </p>
          </div>
        ) : (
          <p>No IP information available.</p>
        )}
      </Fieldset>

      <Fieldset legend="Location" toggleable>
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Fieldset>
      <Fieldset legend="Weather forecast" toggleable>
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <Button label="Sunny" icon={<WbSunny />} />
        <Button label="Cloud" icon={<Cloud />} />
        <Button label="AC Unit" icon={<AcUnit />} />
        <Button label="Air" icon={<Air />} />
        <Button label="Water" icon={<Water />} />
        <Button label="Rainy" icon={<BeachAccess />} />
        <Button label="Thermostat" icon={<Opacity />} />
        <Button label="Thunderstorm" icon={<Thunderstorm />} />
        <Button label="Rainy Heavy" icon={<WbIncandescentOutlined />} />
        <Button label="Rainy Light" icon={<CloudDone />} />
      </Fieldset>
    </>
  );
}
