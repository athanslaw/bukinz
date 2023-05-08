import React from 'react';
import KanoMap from './maps/KanoMap';
import EkitiMap from './maps/EkitiMap';
import OyoMap from './maps/OyoMap';
import OsunMap from './maps/OsunMap';
import AbiaMap from './maps/AbiaMap';
import AdamawaMap from './maps/AdamawaMap';
import AkwaIbomMap from './maps/AkwaIbomMap';
import AnambraMap from './maps/AnambraMap';
import BauchiMap from './maps/BauchiMap';
import BayelsaMap from './maps/BayelsaMap';
import BenueMap from './maps/BenueMap';
import BornoMap from './maps/BornoMap';
import CrossRiverMap from './maps/CrossRiverMap';
import DeltaMap from './maps/DeltaMap';
import EbonyiMap from './maps/EbonyiMap';
import EdoMap from './maps/EdoMap';
import EnuguMap from './maps/EnuguMap';
import GombeMap from './maps/GombeMap';
import ImoMap from './maps/ImoMap';
import JigawaMap from './maps/JigawaMap';
import KadunaMap from './maps/KadunaMap';
import KatsinaMap from './maps/KatsinaMap';
import KebbiMap from './maps/KebbiMap';
import KogiMap from './maps/KogiMap';
import KwaraMap from './maps/KwaraMap';
import LagosMap from './maps/LagosMap';
import NasarrawaMap from './maps/NasarrawaMap';
import NigerMap from './maps/NigerMap';
import OgunMap from './maps/OgunMap';
import OndoMap from './maps/OndoMap';
import PlateauMap from './maps/PlateauMap';
import RiversMap from './maps/RiversMap';
import SokotoMap from './maps/SokotoMap';
import TarabaMap from './maps/TarabaMap';
import YobeMap from './maps/YobeMap';
import ZamfaraMap from './maps/ZamfaraMap';
import AbujaMap from './maps/AbujaMap';
import NigeriaMap from './maps/NigeriaMap';

const GenericMap = ({defaultState}) => {
    const activeState = defaultState+'';
    return (
        <>
            {activeState==='19' && <KanoMap />}
            {activeState==='13' && <EkitiMap />}
            {activeState==='30' && <OyoMap />}
            {activeState==='29' && <OsunMap />}
            {activeState==='1' && <AbiaMap />}
            {activeState==='2' && <AdamawaMap />}
            {activeState==='3' && <AkwaIbomMap />}
            {activeState==='4' && <AnambraMap />}
            {activeState==='5' && <BauchiMap />}
            {activeState==='6' && <BayelsaMap />}
            {activeState==='7' && <BenueMap />}
            {activeState==='8' && <BornoMap />}
            {activeState==='9' && <CrossRiverMap />}
            {activeState==='10' && <DeltaMap />}
            {activeState==='11' && <EbonyiMap />}
            {activeState==='12' && <EdoMap />}
            {activeState==='14' && <EnuguMap />}
            {activeState==='15' && <GombeMap />}
            {activeState==='16' && <ImoMap />}
            {activeState==='17' && <JigawaMap />}
            {activeState==='18' && <KadunaMap />}
            {activeState==='20' && <KatsinaMap />}
            {activeState==='21' && <KebbiMap />}
            {activeState==='22' && <KogiMap />}
            {activeState==='23' && <KwaraMap />}
            {activeState==='24' && <LagosMap />}
            {activeState==='25' && <NasarrawaMap />}
            {activeState==='26' && <NigerMap />}
            {activeState==='27' && <OgunMap />}
            {activeState==='28' && <OndoMap />}
            {activeState==='31' && <PlateauMap />}
            {activeState==='32' && <RiversMap />}
            {activeState==='33' && <SokotoMap />}
            {activeState==='34' && <TarabaMap />}
            {activeState==='35' && <YobeMap />}
            {activeState==='36' && <ZamfaraMap />}
            {activeState==='37' && <AbujaMap />}
            {activeState==='nigeria' && <NigeriaMap />}
        </>
    );
}

export default GenericMap;