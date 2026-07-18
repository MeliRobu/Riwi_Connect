import { home } from "../../pages/home";
import { loginRegister } from "../../pages/login-register";
import {teams_view} from "../../pages/teams";
import { dashboard } from "../../pages/dashboard";
import { smart_profile } from "../../pages/smart_profile";
import { assessment } from "../../pages/assessment";
import { assessment_result } from "../../pages/assessment_results";
import { page404 } from "../../pages/404";
import { admin_home } from "../../pages/admin/admin_home";
import {question_bank} from "../../pages/admin/questions"
import {statistics_view} from "../../pages/admin/statistics";
import {teams_overview} from "../../pages/admin/admin_teams";
import { recommendations_view } from "../../pages/recomendation";
/**
 * SPA Route Registry
 * Maps application URL hash paths to their respective view configuration objects.
 * Each route defines its access control privacy level, a setup lifecycle hook, 
 * and the corresponding page rendering function.
 * * @type {Object.<string, {isPrivate: boolean, setup: function, render: function}>}
 */
export const routes = {

  "/" : {
    isPrivate: false,
    setup: () => {},
    render: home,
    admin: false,
  },
  "/login":{
    isPrivate: false,
    setup: () => {},
    render: loginRegister,
    admin: false
  },
  "/register": {
    isPrivate: false,
    setup: () => {},
    render: loginRegister,
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
    render: teams_view,
    admin:false,
    requiresAssessment: true
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
    render: page404,
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
    render: question_bank,
    admin: true
  },
  "/statistics" : {
    isPrivate : true,
    setup : () => {},
    render : statistics_view,
    admin: true
  },
  "/admin_teams" : {
    isPrivate : true,
    setup : () => {},
    render : teams_overview,
    admin: true
  },
  "/recommendations" : {
    isPrivate: true,
    setup: () => {},
    render: recommendations_view,
    admin: false,
    requiresAssessment: true
  }
};