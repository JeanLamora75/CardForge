/** Presentation only: the illustration is optional until the approved artwork is available.
 * The frame and values remain independent of the art and of the rules engine.
 */
export interface GrimDelveCardProps {
  label:string; title:string; value:number; faction:string; symbol:string; crest:string;
  monster:boolean; selected?:boolean; target?:boolean; disabled?:boolean;
  onClick?:()=>void; illustration?:string;
}
export default function GrimDelveCard({label,title,value,faction,symbol,crest,monster,selected=false,target=false,disabled=false,onClick,illustration}:GrimDelveCardProps) {
  return <button type="button" className="grim-card" data-monster={monster||undefined} data-faction={faction} data-target={target||undefined}
    aria-pressed={onClick?selected:undefined} aria-label={label} onClick={onClick} disabled={disabled||!onClick}>
    <span className="gd-card-art" aria-hidden="true">{illustration?<img src={illustration} alt="" draggable={false}/>:<span className="grim-card-crest">{crest}</span>}</span>
    <span className="gd-card-frame" aria-hidden="true"/>
    <span className="gd-card-data"><span className="gd-card-value" aria-hidden="true">{value}</span><span className="gd-card-suit" aria-hidden="true">{symbol}</span>
      <strong>{title}</strong><small className="gd-sr-only">{monster?"Résistance":"Puissance"} : {value}</small>
    </span>
  </button>;
}
