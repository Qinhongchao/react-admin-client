
import ajax from './ajax'

const BASE_URL='';

export const reqLogin=(username,password)=>{
    return ajax(BASE_URL+'/login',{username,password},'POST')
}
