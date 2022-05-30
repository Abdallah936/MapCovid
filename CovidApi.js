import axios from "axios";

export const getPlaces = async () => {
  const res = await axios.get("https://disease.sh/v3/covid-19/countries");
  const { data } = res;

  const geoJSON = {
    type: "FeatureCollection",
    features: data.map((pays) => {
      const { countryInfo } = pays;
      const { lat, long: lng, flag } = countryInfo;
      return {
        type: "Feature",
        properties: { ...pays, drapeau: flag },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
    }),
  };

  return geoJSON;
};
