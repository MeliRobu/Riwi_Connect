
import { home } from "../../pages/home";
import { login } from "../../pages/login";
import { register } from "../../pages/register";
import { teams } from "../../pages/teams";
import { dashboard } from "../../pages/dashboard";
import { smart_profile } from "../../pages/smart_profile";
import { assessment } from "../../pages/assessment";
import { assessment_result } from "../../pages/assessment_results";
import { not_found } from "../../pages/not_found";

export const routes = {

  "/home" : {
    isPrivate:false,
    setup: () => {},
    render: home
  },
  "/login":{
    isPrivate:false,
    setup: () => {},
    render: login
  },
  "/register": {
    isPrivate: false,
    setup: () => {},
    render: register
  }, 

  "/dashboard" : {
    isPrivate:true,
    setup: () => {},
    render: dashboard
  }
  ,
  "/teams" :{
    isPrivate: true,
    setup :() =>{},
    render: teams
  },
  "/profile" : {
    isPrivate: true,
    setup: () =>{},
    render: smart_profile,
  },
  "/assessment" : {
    isPrivate: true,
    setup: () => {},
    render: assessment
  },
  "/assesment-result" : {
    isPrivate: true,
    setup : () => {},
    render : assessment_result
  },
  "/not-found" : {
    isPrivate: false,
    setup: () => {},
    render: not_found
  }
};