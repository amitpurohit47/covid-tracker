import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import Infobox from "./Components/Infobox/Infobox";
import Map from "./Components/Map/Map";
import Table from "./Components/Table/Table";
import Linegraph from "./Components/LineGraph/Linegraph";
import { prettyPrintStat, sortData } from "./utils/utils";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCoutries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 19.076, lng: 72.8777 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    const fetchinit = async () => {
      try {
        const res = await axios.get("https://disease.sh/v3/covid-19/all");
        const data = res.data;
        setCountryInfo(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchinit();
  }, []);

  const fetchdata = async () => {
    try {
      const res = await axios.get("https://disease.sh/v3/covid-19/countries");
      const data = res.data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      const sortedData = sortData(res.data);
      setMapCountries(res.data);
      setTableData(sortedData);
      setCoutries(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const onCountryChange = async (e) => {
    e.preventDefault();
    const code = e.target.value;
    setCountry(code);
    // console.log(code);
    const url =
      code === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${code}`;
    try {
      const res = await axios.get(url);
      const data = res.data;
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      setCountryInfo(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="header_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* Title + Search input */}

        <div className="app_infoContainer">
          <Infobox
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            onClick={(e) => setCaseType("cases")}
            active = {caseType === "cases"}
            isRed = {true}
          ></Infobox>
          <Infobox
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCaseType("recovered")}
            active = {caseType === "recovered"}
          ></Infobox>
          <Infobox
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={(e) => setCaseType("deaths")}
            active = {caseType === "deaths"}
            isBlack = {true}
          ></Infobox>
        </div>

        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <Linegraph  />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
