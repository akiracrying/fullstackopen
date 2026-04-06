import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
console.log('apikey:',api_key)

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    console.log('fetching weather for', capital)
    console.log('url:', `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log('weather data:', response.data)
        setWeather(response.data)
      })
      .catch(error => {
        console.log('weather error:',error.response.status,error.response.data)
      })
  }, [capital])
  if (!weather) return null
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}
const CountryDetails = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(lang =>
          <li key={lang}>{lang}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="150" />
      <Weather capital={country.capital[0]} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showCountry, setShowCountry] = useState(null)
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
      setCountries(response.data)
    })
  }, [])
  useEffect(() => {
    setShowCountry(null)
  }, [filter])
  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  const showCountries = () => {
    if (filter == '') return null
    if (filtered.length > 10) return <p>Too many matches, specify another filter</p>
    if (filtered.length == 1) return <CountryDetails country={filtered[0]} />
    if (showCountry) return <CountryDetails country={showCountry} />
    return (
      <div>
        {filtered.map(c =>
          <p key={c.name.common}>
            {c.name.common}
            <button onClick={() => setShowCountry(c)}>show</button>
          </p>
        )}
      </div>
    )
  }
  return (
    <div>
      find countries <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {showCountries()}
    </div>
  )
}

export default App
