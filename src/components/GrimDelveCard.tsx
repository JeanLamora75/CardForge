export interface GrimDelveCardProps {
 label:string;title:string;value:number;faction:string;symbol:string;monster:boolean;
 selected?:boolean;target?:boolean;disabled?:boolean;onClick?:()=>void;
 illustration:string;frame:string;emblem?:string;
}
export default function GrimDelveCard({label,title,value,faction,symbol,monster,selected=false,target=false,disabled=false,onClick,illustration,frame,emblem}:GrimDelveCardProps){
 return <button type="button" className="grim-card" data-i18n-ignore data-monster={monster||undefined} data-faction={faction} data-target={target||undefined}
 aria-pressed={onClick?selected:undefined} aria-label={label} onClick={onClick} disabled={disabled||!onClick}>
 <span className="gd-card-art" aria-hidden="true"><img src={illustration} alt="" draggable={false}/></span>
 <span className="gd-card-frame" aria-hidden="true"><img src={frame} alt="" draggable={false}/></span>
 <span className="gd-card-data"><span className="gd-card-value" aria-hidden="true">{value}</span><span className="gd-card-suit" aria-hidden="true">{emblem?<img src={emblem} alt=""/>:null}<span>{symbol}</span></span><strong>{title}</strong></span>
 </button>;
}
