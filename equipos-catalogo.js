// Catálogo base de equipos, tomado de INVENTARIO_DE_BODEGA.xlsx (hoja "Lista de Equipos").
// Esto se usa una sola vez para "sembrar" la colección `equipos` en Firestore desde admin.html.
// Una vez sembrado, la app lee siempre desde Firestore (así puedes agregar/editar equipos
// desde admin.html sin tocar código).
export const EQUIPOS_BASE = [
  {equipo:"B001", pechera:"24CUV00B50153", l24:"086A117", l12:"087G109", l48:"087A107", mosA:"MS2T22ZRC043J0347", mosAl:"4345", arnes:"24CUS021B0723", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B002", pechera:"24CUV003E02245", l24:"089A117", l12:"069G109", l48:"082A117", mosA:"MS2T22ZRC043J0340", mosAl:"4254", arnes:"24CUS021B0739", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B003", pechera:"24CUV003E0228", l24:"223A117", l12:"240G109", l48:"034K115", mosA:"MS2T22ZRC043J0341", mosAl:"4101", arnes:"24CUS021I0447", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B004", pechera:"24CUV003E0225", l24:"239A117", l12:"057G109", l48:"080A117", mosA:"MS2T22ZRC043J0326", mosAl:"4345", arnes:"24CUS021B0740", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B005", pechera:"24CUV003E0208", l24:"096A117", l12:"046G109", l48:"009A117", mosA:"MS2T22ZRC043J0330", mosAl:"4254", arnes:"24CUS021B0729", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B006", pechera:"24CUV003E0211", l24:"218A117", l12:"096G109", l48:"073A117", mosA:"MS2T22ZRC043J0327", mosAl:"4254", arnes:"24CUS021B0742", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B007", pechera:"24CUV003E0204", l24:"234A117", l12:"125G109", l48:"016K115", mosA:"MS2T22ZRC043J0303", mosAl:"5010", arnes:"24CUS021B0724", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B008", pechera:"24CUV003E0212", l24:"238A117", l12:"052G109", l48:"014K115", mosA:"MS2T22ZRC043J0302", mosAl:"4345", arnes:"24CUS021I0413", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B009", pechera:"24CUV003E0219", l24:"078A117", l12:"084G109", l48:"066K115", mosA:"MS2T22ZRC043J0328", mosAl:"4254", arnes:"24CUS021I0448", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B010", pechera:"24CUV003E0234", l24:"081A117", l12:"099G109", l48:"262K115", mosA:"MS2T22ZRC043J0355", mosAl:"4345", arnes:"24CUS021I0444", casco:"GALEOR EVO (SP-C008)"},
  {equipo:"B011", pechera:"24CUV003E0205", l24:"220A117", l12:"017E108", l48:"377K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B012", pechera:"24CUV003E0210", l24:"091A117", l12:"138G109", l48:"013G109", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B013", pechera:"24CUV003E0226", l24:"221A117", l12:"137G109", l48:"145K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B014", pechera:"24CUV003E0247", l24:"090A117", l12:"122G109", l48:"309K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B015", pechera:"24CUV003E0238", l24:"237A117", l12:"034E108", l48:"061K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B016", pechera:"24CUV003E0250", l24:"219A117", l12:"126G109", l48:"052K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B017", pechera:"24CUV003E0241", l24:"225A117", l12:"014G109", l48:"342K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B018", pechera:"24CUV003E0246", l24:"079A117", l12:"133G109", l48:"409K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B019", pechera:"24CUV003E0239", l24:"233A117", l12:"006G109", l48:"004K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B020", pechera:"24CUV003E0213", l24:"235A117", l12:"041G109", l48:"046K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B021", pechera:"24CUV003E0223", l24:"083A117", l12:"157G109", l48:"378K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B022", pechera:"24CUV003E0231", l24:"232A117", l12:"064G109", l48:"199K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B023", pechera:"24CUV003E0206", l24:"075A117", l12:"140G109", l48:"149K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B024", pechera:"24CUV003E0243", l24:"074A117", l12:"072G109", l48:"335K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B025", pechera:"24CUV003E0207", l24:"093A117", l12:"141G109", l48:"299K115", mosA:"EN362:2004/B", mosAl:"4254", arnes:"", casco:""},
  {equipo:"B026", pechera:"24CUV003E0242", l24:"240A117", l12:"320G109", l48:"316K115", mosA:"EN362:2004/B", mosAl:"5010", arnes:"", casco:""},
  {equipo:"B027", pechera:"24CUV003E0244", l24:"076A117", l12:"061G109", l48:"092K115", mosA:"EN362:2004/B", mosAl:"5010", arnes:"", casco:""},
  {equipo:"B028", pechera:"24CUV003E0224", l24:"094A117", l12:"090G109", l48:"150K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B029", pechera:"24CUV003E0218", l24:"077A117", l12:"149G109", l48:"001K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""},
  {equipo:"B030", pechera:"24CUV003E0217", l24:"085A117", l12:"007G109", l48:"397K115", mosA:"EN362:2004/B", mosAl:"4345", arnes:"", casco:""}
].map(e => ({...e, last4: e.pechera.slice(-4)}));
