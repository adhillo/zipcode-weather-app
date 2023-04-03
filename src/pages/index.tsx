import React, { useState, useEffect } from "react";

interface ErrorData {
  error: string;
}

export interface WeatherData {
  location: string;
  temp: number;
  precip: number;
}

const Home: React.FC = () => {
  const [zipCode, setZipCode] = useState("94582");
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchWeatherData = async (
    us_zip: string
  ): Promise<WeatherData | ErrorData> => {
    try {
      const response = await fetch(`./api/weather?us_zip=${us_zip}`);
      if (!response.ok) {
        const bad_response = await response.json();
        setError(bad_response.error);
        setWeatherData(undefined);
        return bad_response;
      }
      const data = await response.json();
      setWeatherData(data);
      setError(undefined);
      return data;
    } catch (error) {
      console.error(error);
      return { error: "A network error occurred while fetching weather data." };
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const zipFormatRegex = /^\d{5}$/;
    if (!zipFormatRegex.test(zipCode)) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setIsLoading(true);
    await fetchWeatherData(zipCode);
    setIsLoading(false);
  };

  useEffect(() => {
    async function firstFetch() {
      setIsLoading(true);
      await fetchWeatherData(zipCode);
      setIsLoading(false);
    }

    firstFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-row justify-center items-center">
        <label htmlFor="zipCode" className=" m-1">Enter a Zip Code:</label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          className="  m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Get Weather
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : weatherData ? (
        <div>
          <h1>Current Zipcode: {weatherData.location}</h1>
          <p>Temperature: {weatherData.temp} °F</p>
          <p>Precipitation: {weatherData.precip} inches</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
};

export default Home;
