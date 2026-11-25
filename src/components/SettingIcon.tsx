type Kind="language"|"audio"|"comfort"|"privacy"|"about";
export function SettingIcon({kind}:{kind:Kind}){
 return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==="language"?<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></>:kind==="audio"?<><path d="M4 9h4l5-4v14l-5-4H4zM16 8q5 4 0 8M19 5q8 7 0 14"/></>:kind==="comfort"?<><circle cx="12" cy="4" r="2"/><path d="M4 8l8 2 8-2M12 10v5m0 0-5 6m5-6 5 6"/></>:kind==="privacy"?<><path d="M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/></>:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>}</svg>;
}
