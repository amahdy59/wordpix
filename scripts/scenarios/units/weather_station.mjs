/**
 * Unit 42: The Weather Station (weather-station)
 * 5 Lessons — 100% Target Vocabulary Coverage
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 * Audited against Cambridge & Oxford English pedagogical frameworks.
 */

export const WEATHER_STATION_SCENARIOS = {
  unitId: "weather-station",
  unitName: "The Weather Station",
  cefr: "A1",
  unitNameEn: "The Weather Station",
  unitNameAr: "محطة الأرصاد الجوية",
  lessons: [
    {
      id: "weather-station-1",
      name: "The Weather Station 1",
      titleEn: "Observation Deck & Rainfall Patterns",
      titleAr: "منصة المراقبة وأنماط هطول الأمطار",
      setting: "On the outdoor meteorological observation platform.",
      wordIds: [
        "sunshine", "clear-sky", "partly-cloudy", "warm-breeze", "dry-air",
        "blue-sky", "calm", "mild-temperature", "pleasant", "balmy",
        "rain", "drizzle", "downpour", "puddle", "flood"
      ],
      lines: [
        {
          id: "01_hana_sunshine_clear_sky",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Look out at the horizon, Layla! Bright sunshine fills the clear sky with vibrant blue sky color."
        },
        {
          id: "02_layla_partly_cloudy_breeze",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Yes, Hana, it is partly cloudy toward the hills with a gentle warm breeze and comfortable dry air."
        },
        {
          id: "03_tariq_calm_balmy_conditions",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The weather today is exceptionally calm, with a mild temperature creating pleasant, balmy conditions for our sensors."
        },
        {
          id: "04_layla_downpour_puddles",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "However, yesterday we tracked sudden rain: starting as light drizzle, turning into a torrential downpour, and splashing every street puddle."
        },
        {
          id: "05_adam_drainage_flood_control",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The automated drainage canal prevented any serious street flood, keeping our weather station perimeter safe!"
        }
      ]
    },
    {
      id: "weather-station-2",
      name: "The Weather Station 2",
      titleEn: "Winter Elements, Ice & Post-Storm Optics",
      titleAr: "عناصر الشتاء والجليد وظواهر ما بعد العاصفة",
      setting: "Inspecting winter freeze conditions and post-storm phenomena.",
      wordIds: [
        "rainbow", "umbrella", "raincoat", "rain-boots", "wet-road",
        "snow", "snowflake", "ice", "frost", "hail",
        "sleet", "icicle", "snowstorm", "frozen-pond", "fog"
      ],
      lines: [
        {
          id: "01_layla_valley_rainbow",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Following the thunderstorm, a magnificent seven-colored rainbow arched across the valley."
        },
        {
          id: "02_hana_rain_gear_wet_road",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "I grabbed my yellow umbrella, waterproof raincoat, and tall rubber rain boots to inspect the glistening wet road."
        },
        {
          id: "03_omar_winter_snow_frost",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "In winter, conditions shift dramatically: falling snow blanketed the station, with each intricate snowflake settling on crisp morning frost."
        },
        {
          id: "04_layla_sleet_hail_icicle",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Freezing sleet and frozen hail formed clear ice across the observation deck, leaving a sharp hanging icicle under the roof."
        },
        {
          id: "05_tariq_snowstorm_fog_pond",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "During the severe winter snowstorm, thick morning fog covered the nearby frozen pond completely!"
        }
      ]
    },
    {
      id: "weather-station-3",
      name: "The Weather Station 3",
      titleEn: "Severe Hazards & Primary Sensor Mast",
      titleAr: "المخاطر الجوية الشديدة وصاري أجهزة الاستشعار",
      setting: "Logging extreme weather metrics from the digital sensor mast.",
      wordIds: [
        "thunderstorm", "lightning", "thunder", "tornado", "hurricane",
        "strong-wind", "dust-storm", "heat-wave", "drought", "blizzard",
        "thermometer", "barometer", "anemometer", "rain-gauge", "weather-vane"
      ],
      lines: [
        {
          id: "01_hana_station_monitors_extremes",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Our station monitors severe weather emergencies, from a raging thunderstorm to extreme atmospheric pressure drops."
        },
        {
          id: "02_layla_lightning_cyclones",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Sensors detect jagged lightning, booming thunder, the swirling funnel of a prairie tornado, and the vast eye of an ocean hurricane."
        },
        {
          id: "03_adam_winds_and_drought",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A strong wind can trigger an arid desert dust storm, while prolonged summer heat brings a suffocating heat wave and agricultural drought."
        },
        {
          id: "04_tariq_blizzard_conditions",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "In subpolar regions, a blinding white blizzard challenges meteorological equipment."
        },
        {
          id: "05_layla_sensor_telemetry",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Our station records every metric: temperature on the thermometer, pressure on the barometer, wind speed on the anemometer, rainfall in the rain gauge, and wind direction on the weather vane."
        }
      ]
    },
    {
      id: "weather-station-4",
      name: "The Weather Station 4",
      titleEn: "Upper-Air Telemetry, Satellites & Annual Cycles",
      titleAr: "قياسات الغلاف الجوي العلوي والأقمار والدورات السنوية",
      setting: "Launching a radiosonde weather balloon and calibrating radar dishes.",
      wordIds: [
        "hygrometer", "weather-satellite", "radar-dish", "weather-balloon", "wind-sock",
        "spring", "summer", "autumn", "winter", "temperature",
        "humidity", "wind-speed", "cloud-cover", "sunrise", "sunset"
      ],
      lines: [
        {
          id: "01_layla_weather_balloon_launch",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "At zero-six-hundred, right before sunrise, our team launches a high-altitude weather balloon carrying radio telemetry."
        },
        {
          id: "02_hana_hygrometer_radar_dish",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "On the telemetry mast, the digital hygrometer measures relative humidity, while the orange wind sock and radar dish track gusting wind speed."
        },
        {
          id: "03_tariq_satellite_cloud_cover",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Downlink signals from our polar weather satellite calculate total atmospheric cloud cover across the continent."
        },
        {
          id: "04_layla_annual_calibration",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "We calibrate these telemetry arrays through spring, summer, autumn, and winter to ensure baseline precision."
        },
        {
          id: "05_adam_diurnal_logging",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Logging daily ambient temperature and barometric trends from golden sunrise until glowing sunset keeps our regional forecasts reliable!"
        }
      ]
    },
    {
      id: "weather-station-5",
      name: "The Weather Station 5",
      titleEn: "Daily Weather Conditions & Atmospheric Dew",
      titleAr: "حالات الطقس اليومية وندى الصباح",
      setting: "Reviewing morning surface conditions and synoptic radar scans.",
      wordIds: [
        "sunny", "cloudy", "rainy", "snowy", "windy",
        "stormy", "foggy", "radar", "satellite", "dew"
      ],
      lines: [
        {
          id: "01_hana_morning_dew",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Good morning! Early dawn reveals sparkling morning dew clinging to the weather station grass."
        },
        {
          id: "02_layla_weekly_weather_log",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Over the course of a single week, our logbook recorded sunny, cloudy, rainy, snowy, and windy days."
        },
        {
          id: "03_tariq_fog_storm_radar",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "When mountain passes become densely foggy or stormy, transport departments rely on our Doppler radar scans."
        },
        {
          id: "04_adam_satellite_synthesis",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Integrating real-time radar echoes with thermal satellite imagery guarantees travelers reach their destinations safely!"
        }
      ]
    }
  ]
};
