export const round = (number, pad) => {
  if(!pad) return Math.round(number);
  
  const rounder = Math.pow(10, pad);
  return Math.round(number * rounder) / rounder;
}


export const setObjToCookie = (cookieName, obj) => {
  let cookieValue = '';
  try{
    if(obj){
      cookieValue = JSON.stringify(obj);
    }
  }catch(e){
    console.error('Problem stringifying obj', obj);
  }
  setCookie(cookieName, cookieValue);
}

export const getCookieObj = cookieName => {
  const cookieString = getCookie(cookieName);
  if(cookieString){
    try{
      return JSON.parse(cookieString);
    }catch(e){
      console.error('Problem parsing cookieString', cookieString);
      return null;
    }
  }else{
    return null;
  }
}

export const setCookie = (cname, cvalue) => {
  var d = new Date();
  d.setTime(d.getTime() + 3000000000000);
  var expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export const getCookie = (cname) => {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

