export const commaSeparateNumber = (val) =>{
  if(!val)  return 0;
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
};

export const cleanStateCode = state => {
    return state > 9 ? state : '0'+state;
}

export const ROLES_TO_SEE_STATE = ["executive", "administrator", "national executive"];
export const ROLES_NOT_TO_SEE_STATE = ["user", "manager"];