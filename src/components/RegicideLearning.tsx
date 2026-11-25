import {useState} from 'react';
import type {Locale} from '../i18n/language.ts';
import RegicideBoard from './RegicideBoard.tsx';
import {REGICIDE_LESSONS,type RegicideLesson} from '../games/regicide/tutorial.ts';
export default function RegicideLearning({language,hintsEnabled,onHintsChange}:{language:Locale;hintsEnabled:boolean;onHintsChange:(v:boolean)=>void}){
 const fr=language==='fr';
 const [lesson,setLesson]=useState<RegicideLesson|null>(null);
 const [run,setRun]=useState(0);
 const titles={combat:fr?'Combat et pouvoirs':'Combat and powers',recruitment:fr?'Recrutement exact':'Exact recruitment',joker:fr?'Renouvellement Joker':'Joker renewal',defence:fr?'Défense et riposte':'Defence and retaliation'};
 const tips={combat:fr?'Jouez le 8 de Trèfle : résolvez les pouvoirs puis les dégâts.':'Play the 8 of Clubs: resolve powers, then damage.',recruitment:fr?'Jouez le 10 de Trèfle : 20 dégâts exacts recrutent le Valet.':'Play the 10 of Clubs: exactly 20 damage recruits the Jack.',joker:fr?'Activez un Joker et confirmez le renouvellement de la main.':'Activate a Joker and confirm hand renewal.',defence:fr?'Sélectionnez 6 et 5 pour couvrir la riposte de 10.':'Select 6 and 5 to cover retaliation of 10.'};
 return <section data-i18n-ignore className="game-learning"><div className="learning-toolbar"><button className="secondary-action" onClick={()=>setLesson(null)} aria-pressed={lesson===null}>{fr?'Partie normale':'Normal game'}</button>{REGICIDE_LESSONS.map(id=><button key={id} className="secondary-action" aria-pressed={lesson===id} onClick={()=>{setLesson(id);setRun(r=>r+1);}}>{titles[id]}</button>)}<label><input type="checkbox" checked={hintsEnabled} onChange={e=>onHintsChange(e.target.checked)}/>{fr?'Aide contextuelle':'Contextual help'}</label></div>{lesson?<p className="ldt-lesson" role="status">{tips[lesson]}</p>:null}<RegicideBoard key={lesson?lesson+run:'normal'} lesson={lesson??undefined} language={language} hintsEnabled={hintsEnabled}/></section>;
}
