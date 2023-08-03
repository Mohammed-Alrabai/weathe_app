import {
  createTheme,
  ThemeProvider,
  styled,
  Typography,
  Container,
  Icon,
  Button,
} from "@mui/material";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/ar-sa";
moment.locale("ar-sa");

import { useTranslation } from "react-i18next";
// Icon Import
import { AiFillCloud } from "react-icons/ai";

let cancelAxios = null;
function App() {
  const { t , i18n } = useTranslation();
  const theme = createTheme({
    typography: {
      fontFamily: ["IBM"],
    },
  });
  const [data, setData] = useState();
  const [date, setDate] = useState();
  const apiKey = "30f9b146b81c18538b67f64078dfff9a";
  const [locale, setLocale] = useState("ar");

  let handelChangeLanguage = () => {
    if (locale === "ar") {
      setLocale("en");
      i18n.changeLanguage("en");
    } else {
      setLocale("ar");
      i18n.changeLanguage("ar");
    }
  };
  useEffect(() => {
        i18n.changeLanguage(locale);
  } , []);

  useEffect(() => {
    const lat = 24.774265;
    const lon = 46.738586;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((res) => {
        setData({
          name: res.data.name,
          temp: res.data.main.temp,
          description: res.data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
          wind: res.data.wind.speed,
          max: res.data.main.temp_max,
          min: res.data.main.temp_min,
        });
        const date = moment(res.data.dt * 1000);
        setDate(date.format("L"));
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      cancelAxios();
    };
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="sm"
          sx={{ width: "100%" }}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          {/* Card Container */}
          <div
            style={{
              height: "100vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {/* Card  */}
            <div
              style={{
                width: "100%",
                backgroundColor: "rgb(28 52 91 / 36%)",
                borderRadius: "10px",
                padding: "20px",
                color: "white",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              }}>
              {/* content */}
              <div>
                {/* city & time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Typography
                    variant="h2"
                    sx={{ textAlign: "center", fontWeight: "600" }}>
                    {t(data?.name)}
                  </Typography>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    {date}
                  </Typography>
                </div>
                {/* == city & time == */}
                <hr />
                {/* container for degrees & icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}>
                  {/* degrees & description */}
                  <div>
                    {/* temp */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <Typography variant="h1" sx={{ textAlign: "right" }}>
                        {Math.floor(data?.temp)}
                      </Typography>
                      {/* todo:temp image */}
                      <img src={data?.icon} />
                    </div>
                    {/* == temp == */}
                    <Typography variant="h6">{t(data?.description)}</Typography>
                    {/* min & max */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <Typography variant="h6">{t("min")}:{data?.min}</Typography>
                      <Typography variant="h6">|</Typography>
                      <Typography variant="h6">{t("max")}:{data?.max}</Typography>
                    </div>
                  </div>
                  {/* == degrees & description == */}
                  <Icon component={AiFillCloud} sx={{ fontSize: "200px" }} />
                </div>
              </div>
              {/* == content == */}
            </div>
            {/*== Card  ==*/}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "end",
              }}>
              <Button
                variant="text"
                size="large"
                sx={{
                  color: "white",
                  px: "40px",
                  my: "10px",
                }}
                onClick={handelChangeLanguage}>
                {i18n.language === "ar" ? "English" : "العربية"}
              </Button>
            </div>
          </div>
          {/* == Card Container == */}
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
