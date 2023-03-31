import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { us_zip } = req.query;


  const headers = new Headers({
    "X-RapidAPI-Key": process.env.API_key ?? "",
    "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
  });

  try {
    const response = await fetch(
      `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${us_zip}&contentType=json&unitGroup=us&shortColumnNames=0`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const data = await response.json();


    const locationName = Object.keys(data.locations)[0];
    const values = data.locations[locationName].values;
    const firstDayTemp = values[0].temp;
    const firstDayPrecip = values[0].precip;

    res.status(200).json({
      location: locationName,
      temp: firstDayTemp,
      precip: firstDayPrecip,
    });
  } catch (error) { 
    console.log(error);
    res
      .status(500)
      .json({ error: "An API error occurred while fetching weather data. Check validity of proposed zip code." });
  }
}
