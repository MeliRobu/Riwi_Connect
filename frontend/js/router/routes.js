import { home } from "../../pages/home";
import { login } from "../../pages/login";
import { register } from "../../pages/register";
import { teams } from "../../pages/teams";
import { dashboard } from "../../pages/dashboard";
import { smart_profile } from "../../pages/smart_profile";
import { assessment } from "../../pages/assessment";
import { assessment_result } from "../../pages/assessment_results";
import { not_found } from "../../pages/not_found";
import { admin_home } from "../../pages/admin/admin_home";
import { questions } from "../../pages/admin/questions";
import { statistics } from "../../pages/admin/statistics";
import { admin_teams } from "../../pages/admin/teams";

/**
 * SPA Route Registry
 * Maps application URL hash paths to their respective view configuration objects.
 * Each route defines its access control privacy level, a setup lifecycle hook, 
 * and the corresponding page rendering function.
 * * @type {Object.<string, {isPrivate: boolean, setup: function, render: function}>}
 */
export const routes = {

  "/home" : {
    isPrivate: false,
    setup: () => {},
    render: home,
    admin: false,
  },
  "/login":{
    isPrivate: false,
    setup: () => {},
    render: login,
    admin: false
  },
  "/register": {
    isPrivate: false,
    setup: () => {},
    render: register,
    admin:false
  }, 

  "/dashboard" : {
    isPrivate: true,
    setup: () => {},
    render: dashboard,
    admin:false
  },
  "/teams" :{
    isPrivate: true,
    setup: () => {},
    render: teams,
    admin:false
  },
  "/profile" : {
    isPrivate: true,
    setup: () => {},
    render: smart_profile,
    admin: false
  },
  "/assessment" : {
    isPrivate: true,
    setup: () => {},
    render: assessment,
    admin:false
  },
  "/assesment-result" : {
    isPrivate: true,
    setup: () => {},
    render: assessment_result,
    admin : false
  },
  "/not-found" : {
    isPrivate: false,
    setup: () => {},
    render: not_found,
    admin : false
  },
  "/admin_home":{
    isPrivate: true,
    setup : () => {},
    render: admin_home,
    admin : true,
  },
  "/questions" : {
    isPrivate : true,
    setup: () => {},
    render: questions,
    admin: true
  },
  "/statistics" : {
    isPrivate : true,
    setup : () => {},
    render : statistics,
    admin: true
  }
};