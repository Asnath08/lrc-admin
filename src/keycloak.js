import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url:      "https://keycloak.nafaan.com",
  realm:    "lerece",
  clientId: "lerece-frontend", 
});

export default keycloak;