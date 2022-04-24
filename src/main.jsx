import inject from 'seacreature/lib/inject'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useVirtual } from 'react-virtual'
import { DateTime } from 'luxon'
import { useDraggable } from 'react-use-draggable-scroll'

const Draggable = ({ position, children, onDragStart, onDrag, onDragEnd }) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: [0, 0],
    delta: [0, 0]
  })

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      isDragging: true,
      origin: [clientX, clientY]
    }))
    onDragStart({ clientX, clientY })
  }, [onDragStart])

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const delta = [clientX - state.origin[0], clientY - state.origin[1]]
      const res = onDrag({ delta })
      if (res) setState(state => ({ ...state, delta: res }))
      else setState(state => ({ ...state, delta }))
    },
    [state.origin, onDrag]
  )

  const handleMouseUp = useCallback(() => {
    setState(state => ({ ...state, isDragging: false, delta: [0, 0] }))
    onDragEnd({ delta: state.delta })
  }, [onDragEnd, state.delta])

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp])

  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${position[0] + state.delta[0]}px, ${position[1] + state.delta[1]}px)`,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? 2 : 1,
      position: state.isDragging ? 'absolute' : 'relative'
    }),
    [position, state.isDragging, state.delta]
  )

  return (
    <div style={styles} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}

const col_width = 120
const row_height = 26

const throttle = (fn, ms) => {
  let t = null
  let arg_top = null
  let arg_left = null
  return (top, left) => {
    if (top != null) arg_top = top
    if (left != null) arg_left = left
    if (!t) {
      t = setTimeout(() => {
        t = null
        fn(arg_top, arg_left)
      }, ms)
    }
  }
}

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
// TODO: leap year improvement?
const month_days = range(0, 11).map(n => {
  const start_at = DateTime.fromISO('2020-01-01').plus({ months: n })
  const end_at = start_at.plus({ months: 1 })
  return end_at.diff(start_at, 'days').as('days')
})
const offset_start = d => ((d.day - 1) / month_days[d.month - 1]) * col_width
const offset_end = d => (d.day / month_days[d.month - 1]) * col_width

const TimelimeAxis = props => {
  const parentRef = React.useRef(false)

  const col_v = useVirtual({
    horizontal: true,
    size: props.size,
    parentRef,
    estimateSize: React.useCallback(() => col_width, []),
    scrollOffsetFn(e) {
      const left = e?.target.scrollLeft ?? 0
      props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
      return left
    }
  })

  React.useEffect(() => {
    if ('scrollOffsetLeft' in props)
      col_v.scrollToOffset(props.scrollOffsetLeft)
  }, [props.scrollOffsetLeft])

  return (
    <div ref={parentRef} className='timeline-axis'>
      <div style={{ width: `${col_v.totalSize}px`, position: 'relative' }}>
        {props.render(col_v.virtualItems, (i, s) => (
          <div
            key={i.index}
            style={{
              width: `${i.size}px`,
              transform: `translateX(${i.start}px)`
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

const TaskAxis = props => {
  const parentRef = React.useRef(false)

  const row_v = useVirtual({
    size: props.size,
    parentRef,
    estimateSize: React.useCallback(() => row_height, []),
    scrollOffsetFn(e) {
      const top = e?.target.scrollTop ?? 0
      props.setScrollOffsetTop && props.setScrollOffsetTop(top)
      return top
    }
  })

  React.useEffect(() => {
    if ('scrollOffsetTop' in props) row_v.scrollToOffset(props.scrollOffsetTop)
  }, [props.scrollOffsetTop])

  return (
    <div ref={parentRef} className='task-axis'>
      <div style={{ height: `${row_v.totalSize}px`, position: 'relative' }}>
        {props.render(row_v.virtualItems, (i, s) => (
          <div
            key={i.index}
            style={{
              height: `${i.size}px`,
              transform: `translateY(${i.start}px)`
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

const Schedule = props => {
  const parentRef = React.useRef(false)
  const { events } = useDraggable(parentRef)

  const row_v = useVirtual({
    size: props.row_size,
    parentRef,
    estimateSize: React.useCallback(() => row_height, []),
    scrollOffsetFn(e) {
      const top = e?.target.scrollTop ?? 0
      props.setScrollOffsetTop && props.setScrollOffsetTop(top)
      return top
    }
  })

  const col_v = useVirtual({
    horizontal: true,
    size: props.col_size,
    parentRef,
    estimateSize: React.useCallback(() => col_width, []),
    scrollOffsetFn(e) {
      const left = e?.target.scrollLeft ?? 0
      props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
      return left
    }
  })

  React.useEffect(() => {
    if ('scrollOffsetTop' in props) row_v.scrollToOffset(props.scrollOffsetTop)
  }, [props.scrollOffsetTop])

  // React.useEffect(() => {
  //   if ('scrollOffsetLeft' in props) col_v.scrollToOffset(props.scrollOffsetLeft)
  // }, [props.scrollOffsetLeft])

  return (
    <div {...events} ref={parentRef} className='schedule-grid'>
      <div
        style={{
          height: `${row_v.totalSize}px`,
          width: `${col_v.totalSize}px`,
          position: 'relative'
        }}
      >
        {props.render(
          row_v.virtualItems,
          col_v.virtualItems,
          (r, c, s) =>
            s && (
              <div
                key={`${r.index}/${c.index}`}
                style={{
                  width: `${c.size}px`,
                  height: `${r.size}px`,
                  transform: `translateX(${c.start}px) translateY(${r.start}px)`
                }}
              >
                {s.type == 'startandend' ? (
                  <div
                    className='s e'
                    style={{
                      width: `${s.end - s.start}px`,
                      marginLeft: `${s.start}px`
                    }}
                  ></div>
                ) : s.type == 'start' ? (
                  <div
                    className='s'
                    style={{
                      width: `${col_width - s.start}px`,
                      marginLeft: `${s.start}px`
                    }}
                  ></div>
                ) : s.type == 'end' ? (
                  <div className='e' style={{ width: `${s.end}px` }}></div>
                ) : s.type == 'middle' ? (
                  <div className='m' style={{ width: `${col_width}px` }}></div>
                ) : (
                  ''
                )}
              </div>
            )
        )}
      </div>
    </div>
  )
}

inject('pod', ({ StateContext, HubContext }) => {
  const data = [
    ['Begundeu', 1003, 1057],
    ['Agilinnti', 1020, 1088],
    ['Blildeud', 1022, 1023],
    ['Rofald', 1024, 1027],
    ['Chulfrti', 1026, 1028],
    ['Clon', 1028, 1077],
    ['Hertkmi', 1030, 1116],
    ['Waderartm', 1032, 1123],
    ['Gudalev', 1034, 1045],
    ['Adardarg', 1036, 1082],
    ['Gungararun', 1041, 1096],
    ['Gildaind', 1038, 1121],
    ['Lenunoc', 1053, 1117],
    ['Hindil', 1056, 1108],
    ['Therud', 1058, 1059],
    ['Erudasild', 1061, 1140],
    ['Lesschan', 1063, 1134],
    ['Andand', 1066, 1151],
    ['Leuisc', 1069, 1144],
    ['Adrtisia', 1071, 1135],
    ['Cheldol', 1074, 1145],
    ['Auldb', 1076, 1077],
    ['Belbeveosi', 1062, 1155],
    ['Emnaridge', 1081, 1148],
    ['Hueberth', 1084, 1178],
    ['Aunderald', 1086, 1151],
    ['Berarbe', 1089, 1165],
    ['Ameraro', 1091, 1099],
    ['Luisero', 1094, 1096],
    ['Rodeliva', 1098, 1099],
    ['Beldading', 1089, 1162],
    ['Artu', 1111, 1189],
    ['Adendader', 1114, 1192],
    ['Dandmnk', 1116, 1207],
    ['Arerthe', 1120, 1222],
    ['Thengada', 1125, 1188],
    ['Emegir', 1127, 1214],
    ['Rosarara', 1133, 1134],
    ['Hingerdr', 1080, 1139],
    ['Adilde', 1103, 1142],
    ['Chmbano', 1105, 1106],
    ['Beg', 1108, 1109],
    ['Emegadect', 1110, 1175],
    ['Hisandg', 1113, 1181],
    ['Winailar', 1117, 1122],
    ['Ramarde', 1120, 1132],
    ['Inadeudard', 1122, 1191],
    ['Manchl', 1114, 1213],
    ['Aderdeldrd', 1142, 1212],
    ['Auldevais', 1144, 1150],
    ['Bendudm', 1147, 1231],
    ['Hischtr', 1149, 1249],
    ['Eberth', 1151, 1234],
    ['Befaldeldar', 1153, 1247],
    ['Hudeo', 1157, 1235],
    ['Adalderdo', 1159, 1236],
    ['Baleud', 1167, 1169],
    ['Fuldordg', 1095, 1151],
    ['Balibert', 1121, 1206],
    ['Pailbedo', 1123, 1191],
    ['Era', 1125, 1200],
    ['Hisisind', 1127, 1128],
    ['Mart', 1129, 1185],
    ['Himbeuist', 1132, 1211],
    ['Thudinar', 1136, 1213],
    ['Aunde', 1140, 1141],
    ['Syrdanbe', 1142, 1240],
    ['Rotilder', 1134, 1222],
    ['Marchid', 1150, 1197],
    ['Hivarli', 1153, 1225],
    ['Asagrr', 1157, 1217],
    ['Chaiul', 1160, 1230],
    ['Eifreber', 1162, 1167],
    ['Rodarengar', 1165, 1209],
    ['Enderurgai', 1167, 1216],
    ['Brtmarber', 1171, 1228],
    ['Aliltrada', 1173, 1176],
    ['Hiomeusere', 1137, 1213],
    ['Belderu', 1169, 1170],
    ['Lertmuss', 1172, 1173],
    ['Berderer', 1174, 1175],
    ['Bersevef', 1176, 1180],
    ['Ogalde', 1178, 1179],
    ['Videri', 1180, 1276],
    ['Hildermasy', 1182, 1223],
    ['Chanuinh', 1184, 1252],
    ['Bunicherd', 1187, 1265],
    ['Erdadint', 1190, 1276],
    ['Suinotg', 1208, 1276],
    ['Audisch', 1225, 1297],
    ['Hidad', 1186, 1248],
    ['Leldon', 1203, 1205],
    ['Bungaderschi', 1206, 1277],
    ['Fotrlisi', 1208, 1220],
    ['Bena', 1211, 1277],
    ['Alangudi', 1213, 1263],
    ['Begollim', 1217, 1220],
    ['Mertare', 1220, 1269],
    ['Fadeldiloda', 1223, 1227],
    ['Erarmundi', 1235, 1289],
    ['Merarale', 1252, 1303],
    ['Cyrindom', 1254, 1336],
    ['Lindel', 1257, 1259],
    ['Rotrungan', 1259, 1326],
    ['Thisarnd', 1262, 1330],
    ['Erndilovid', 1266, 1330],
    ['Goulfril', 1271, 1350],
    ['Lesouli', 1274, 1275],
    ['Emall', 1194, 1293],
    ['Annchar', 1222, 1313],
    ['Meranch', 1225, 1310],
    ['Thebe', 1227, 1309],
    ['Berdidudi', 1230, 1231],
    ['Meramer', 1233, 1234],
    ['Lertino', 1235, 1238],
    ['Fudando', 1238, 1287],
    ['Erdegadiv', 1244, 1328],
    ['Pannna', 1249, 1294],
    ['Endegaras', 1255, 1258],
    ['Chanard', 1030, 1106],
    ['Warbeodo', 1055, 1068],
    ['Anbertr', 1057, 1121],
    ['Alisader', 1059, 1060],
    ['Berildr', 1062, 1100],
    ['Geotheild', 1064, 1125],
    ['Ogegudoferd', 1067, 1068],
    ['Rodil', 1070, 1129],
    ['Bermel', 1072, 1083],
    ['Ergarunda', 1075, 1158],
    ['Boderde', 1077, 1164],
    ['Thiungai', 1084, 1126],
    ['Nodu', 1101, 1169],
    ['Thiscer', 1103, 1154],
    ['Fothi', 1105, 1176],
    ['Hischi', 1108, 1109],
    ['Auderitm', 1110, 1198],
    ['Adalm', 1112, 1199],
    ['Gozotisse', 1115, 1117],
    ['Aderaro', 1117, 1198],
    ['Hiliothise', 1120, 1187],
    ['Erulgude', 1115, 1182],
    ['Leugiser', 1130, 1133],
    ['Borchi', 1133, 1193],
    ['Inarar', 1136, 1149],
    ['Gundera', 1139, 1140],
    ['Fldolduss', 1141, 1215],
    ['Eroderodu', 1143, 1193],
    ['Lolissc', 1146, 1216],
    ['Bauderd', 1153, 1239],
    ['Anskeo', 1157, 1158],
    ['Nomarns', 1068, 1138],
    ['Tuuseuib', 1092, 1153],
    ['Giulerd', 1095, 1151],
    ['Belolon', 1097, 1170],
    ['Bendech', 1100, 1180],
    ['Arichari', 1103, 1107],
    ['Rertkert', 1106, 1109],
    ['Lisindid', 1111, 1161],
    ['Hisadad', 1113, 1211],
    ['Berotmarinoso', 1116, 1194],
    ['Pullli', 1116, 1177],
    ['Charuder', 1147, 1155],
    ['Robsaderdu', 1150, 1214],
    ['Charp', 1152, 1156],
    ['Lirass', 1155, 1232],
    ['Gicer', 1158, 1219],
    ['Oger', 1160, 1194],
    ['Goacherot', 1163, 1217],
    ['Hideraise', 1166, 1250],
    ['Chartha', 1169, 1225],
    ['Cher', 1060, 1121],
    ['Benguder', 1090, 1170],
    ['Emecthis', 1093, 1097],
    ['Lebeud', 1096, 1173],
    ['Endirudeul', 1099, 1157],
    ['Rotrdadeg', 1102, 1103],
    ['Baderdar', 1108, 1161],
    ['Bertinugo', 1098, 1155],
    ['Fogerd', 1124, 1125],
    ['Erurdilarl', 1127, 1190],
    ['Ountfri', 1129, 1136],
    ['Adelpade', 1132, 1137],
    ['Odon', 1135, 1246],
    ['Gerdildet', 1138, 1191],
    ['Adamunge', 1140, 1232],
    ['Roviltradeg', 1143, 1217],
    ['Rotrmerd', 1147, 1192],
    ['Leginde', 1054, 1099],
    ['Gunder', 1082, 1085],
    ['Charerd', 1085, 1158],
    ['Thinaral', 1088, 1101],
    ['Befarunga', 1091, 1169],
    ['Rudert', 1093, 1155],
    ['Bengai', 1096, 1098],
    ['Masol', 1077, 1170],
    ['Fudegido', 1100, 1174],
    ['Gidegribe', 1103, 1104],
    ['Gutrgaidu', 1106, 1165],
    ['Adararas', 1108, 1211],
    ['Andodora', 1110, 1206],
    ['Ogeudild', 1114, 1137],
    ['Hividegu', 1118, 1195],
    ['Gode', 1125, 1139],
    ['Gulech', 1069, 1132],
    ['Liserd', 1086, 1152],
    ['Hiselend', 1088, 1138],
    ['Rotegadel', 1091, 1095],
    ['Anderude', 1094, 1160],
    ['Teuudeg', 1097, 1164],
    ['Adolld', 1100, 1176],
    ['Fodamergar', 1067, 1098],
    ['Peusser', 1083, 1144],
    ['Fongarol', 1085, 1086],
    ['Motherderad', 1087, 1159],
    ['Baltradild', 1089, 1151],
    ['Hlinusa', 1092, 1152],
    ['Budi', 1094, 1095],
    ['Hisaiseth', 1096, 1098],
    ['Rotrudel', 1098, 1194],
    ['Guderuda', 1083, 1155],
    ['Hildischer', 1100, 1171],
    ['Araldo', 1103, 1116],
    ['Hauliltudo', 1106, 1115],
    ['Endische', 1109, 1193],
    ['Hertge', 1111, 1166],
    ['Mosararu', 1115, 1177],
    ['Regimer', 1117, 1118],
    ['Bildodga', 1119, 1120],
    ['Gilolf', 1121, 1122],
    ['Ogadecth', 1044, 1138],
    ['Ogarudeu', 1061, 1062],
    ['Bergunda', 1063, 1149],
    ['Rotrudeve', 1065, 1067],
    ['Bethidisile', 1068, 1130],
    ['Motgaisvar', 1071, 1155],
    ['Betrdele', 1076, 1124],
    ['Sisolm', 1078, 1170],
    ['Leth', 1081, 1159],
    ['Ogadeld', 1080, 1147],
    ['Begechad', 1098, 1184],
    ['Budenara', 1100, 1173],
    ['Endararude', 1103, 1193],
    ['Hinilbe', 1106, 1110],
    ['Gudili', 1109, 1202],
    ['Lisisa', 1111, 1186],
    ['Aulif', 1113, 1114],
    ['Audothadis', 1117, 1183],
    ['Hidermun', 1066, 1150],
    ['Rosveldech', 1087, 1172],
    ['Gudeldudet', 1089, 1129],
    ['Aderili', 1091, 1167],
    ['Erdera', 1093, 1145],
    ['Ararinac', 1097, 1165],
    ['Arinut', 1099, 1157],
    ['Aungerade', 1102, 1103],
    ['Erd', 1108, 1218],
    ['Wussouse', 1061, 1142],
    ['Rosile', 1079, 1140],
    ['Gulparud', 1082, 1160],
    ['Drbardor', 1084, 1182],
    ['Eradecheo', 1087, 1158],
    ['Lobalfr', 1090, 1161],
    ['Bedolulo', 1092, 1096],
    ['Adandi', 1095, 1172],
    ['Hudverdg', 1099, 1104],
    ['Thagiberi', 1042, 1133],
    ['Chanchu', 1075, 1076],
    ['Vigusss', 1078, 1079],
    ['Agisyar', 1080, 1150],
    ['Rotrasist', 1082, 1169],
    ['Beothta', 1084, 1166],
    ['Sintardu', 1087, 1144],
    ['Adadever', 1089, 1142],
    ['Mendadegad', 1094, 1095],
    ['Marthaig', 1104, 1189],
    ['Frinaril', 1120, 1225],
    ['Begicha', 1141, 1238],
    ['Chincha', 1143, 1223],
    ['Rogargele', 1145, 1158],
    ['Autalichi', 1147, 1148],
    ['Alerud', 1150, 1211],
    ['Hiu', 1152, 1240],
    ['Frorthal', 1154, 1255],
    ['Fufrer', 1156, 1234],
    ['Ruderude', 1159, 1170],
    ['Emaisaden', 1161, 1163],
    ['Henod', 1163, 1268],
    ['Emerald', 1119, 1186],
    ['Brondo', 1137, 1216],
    ['Goduldoz', 1140, 1198],
    ['Gudeldegi', 1143, 1144],
    ['Rodildant', 1145, 1148],
    ['Brberich', 1147, 1230],
    ['Adega', 1150, 1198],
    ['Vuinibe', 1152, 1165],
    ['Gildi', 1158, 1225],
    ['Andechil', 1177, 1237],
    ['Histengerdet', 1193, 1281],
    ['Drinnan', 1195, 1277],
    ['Berguder', 1197, 1201],
    ['Sistha', 1199, 1200],
    ['Gicering', 1202, 1240],
    ['Fovertrard', 1205, 1288],
    ['Lierbego', 1208, 1296],
    ['Lilerndi', 1210, 1296],
    ['Hicheop', 1215, 1284],
    ['Ante', 1221, 1290],
    ['Danalfom', 1103, 1167],
    ['Berundud', 1131, 1214],
    ['Adegadam', 1134, 1219],
    ['Hischertr', 1136, 1195],
    ['Bartarb', 1138, 1234],
    ['Thardari', 1141, 1220],
    ['Harerderth', 1145, 1160],
    ['Wamboth', 1148, 1212],
    ['Hil', 1150, 1207],
    ['Golodgin', 1157, 1249],
    ['Eberarth', 1140, 1211],
    ['Berlgideng', 1169, 1257],
    ['Mardo', 1172, 1247],
    ['Aundendis', 1175, 1250],
    ['Hinderti', 1178, 1179],
    ['Berararuth', 1180, 1244],
    ['Berdut', 1183, 1238],
    ['Emarche', 1189, 1190],
    ['Adile', 1145, 1188],
    ['Warduss', 1166, 1245],
    ['Chauineh', 1169, 1170],
    ['Hisctr', 1172, 1232],
    ['Emerould', 1176, 1228],
    ['Hiladi', 1179, 1180],
    ['Emeruldiech', 1173, 1254],
    ['Aldermad', 1190, 1248],
    ['Madarib', 1192, 1260],
    ['Gili', 1194, 1195],
    ['Roteladi', 1196, 1249],
    ['Mameralder', 1199, 1208],
    ['Gudargali', 1201, 1295],
    ['Lerde', 1205, 1285],
    ['Aromari', 1209, 1293],
    ['Erudar', 1212, 1213],
    ['Bam', 1214, 1294],
    ['This', 1170, 1227],
    ['Pariderti', 1189, 1194],
    ['Gudarmud', 1192, 1194],
    ['Gude', 1195, 1279],
    ['Ameu', 1197, 1198],
    ['Amnicheud', 1200, 1285],
    ['Wadudent', 1203, 1293],
    ['Thldri', 1206, 1207],
    ['Analfriso', 1208, 1221],
    ['Berthar', 1211, 1288],
    ['Bodert', 1186, 1246],
    ['Andilder', 1211, 1216],
    ['Erme', 1214, 1226],
    ['Thiltrgadel', 1216, 1218],
    ['Rotrgun', 1218, 1268],
    ['Chortma', 1220, 1221],
    ['Daro', 1223, 1309],
    ['Benderad', 1226, 1285],
    ['Beferderas', 1229, 1313],
    ['Berderge', 1231, 1277],
    ['Lis', 1234, 1287],
    ['Chirdorm', 1217, 1305],
    ['Lalill', 1248, 1345],
    ['Hitharg', 1251, 1322],
    ['Rogeldas', 1254, 1256],
    ['Hobech', 1257, 1258],
    ['Gudelbeld', 1260, 1284],
    ['Endeduer', 1263, 1272],
    ['Algartrt', 1268, 1331],
    ['Agegol', 1271, 1272],
    ['Rardereg', 1247, 1293],
    ['Tharit', 1277, 1356],
    ['Bribanoulb', 1279, 1378],
    ['Aladar', 1282, 1334],
    ['Rotr', 1284, 1333],
    ['Hildeg', 1221, 1297],
    ['Hiararad', 1239, 1321],
    ['Lugomu', 1241, 1242],
    ['Anaiuser', 1244, 1309],
    ['Luvrthu', 1246, 1334],
    ['Rovartra', 1249, 1331],
    ['Lerathi', 1252, 1253],
    ['Endaregu', 1255, 1347],
    ['Araufonn', 1258, 1318],
    ['Artheuu', 1231, 1293],
    ['Leceriba', 1256, 1257],
    ['Bermectr', 1259, 1360],
    ['Mertuser', 1261, 1315],
    ['Grdoda', 1263, 1335],
    ['Ogisaru', 1265, 1333],
    ['Wandoz', 1268, 1350],
    ['Husan', 1271, 1332],
    ['Belthileg', 1273, 1347],
    ['Otgildo', 1277, 1343],
    ['Embeude', 1261, 1334],
    ['Hiltel', 1295, 1395],
    ['Beothilt', 1297, 1298],
    ['Bergade', 1299, 1323],
    ['Inthaisild', 1302, 1382],
    ['Lereriun', 1304, 1305],
    ['Meldader', 1307, 1308],
    ['Fldo', 1310, 1311],
    ['Eruder', 1313, 1409],
    ['Beldeiud', 1316, 1408],
    ['Fadaldisel', 1323, 1327],
    ['Manherin', 1247, 1295],
    ['Gopprdr', 1273, 1324],
    ['Bechisva', 1276, 1350],
    ['Enda', 1279, 1280],
    ['Mosegeverd', 1281, 1359],
    ['Wannobo', 1284, 1357],
    ['Budadivai', 1286, 1364],
    ['Mariche', 1288, 1296],
    ['Erschilde', 1291, 1371],
    ['Guldodga', 1295, 1296],
    ['Lertgertm', 1277, 1336],
    ['Fot', 1300, 1372],
    ['Fadengar', 1303, 1384],
    ['Belelgevi', 1305, 1374],
    ['Begalhil', 1307, 1363],
    ['Gudende', 1309, 1383],
    ['Rungeleld', 1311, 1368],
    ['Thec', 1313, 1316],
    ['Thebereg', 1316, 1321],
    ['Audegeld', 1318, 1408],
    ['Rovaltr', 1321, 1330],
    ['Hlinudod', 1323, 1362],
    ['Herdrti', 1305, 1344],
    ['Archibert', 1340, 1392],
    ['Belpaildilbe', 1342, 1421],
    ['Lebertf', 1345, 1413],
    ['Hilild', 1348, 1349],
    ['Belderutrd', 1351, 1353],
    ['Amardeu', 1353, 1407],
    ['Erudeude', 1355, 1356],
    ['Lildega', 1357, 1424],
    ['Sinssser', 1362, 1431],
    ['Gilaraldi', 1366, 1368],
    ['Lercoli', 1124, 1182],
    ['Amanderer', 1151, 1233],
    ['Hitradel', 1155, 1203],
    ['Gododrard', 1157, 1220],
    ['Hildisil', 1159, 1161],
    ['Lerenarthi', 1163, 1228],
    ['Mechegad', 1172, 1173],
    ['Fustgor', 1158, 1245],
    ['Mar', 1184, 1241],
    ['Endeggara', 1187, 1281],
    ['Hisecher', 1189, 1197],
    ['Auda', 1191, 1192],
    ['Berinuli', 1193, 1231],
    ['Regiss', 1195, 1197],
    ['Adgeuda', 1198, 1201],
    ['Audegeradeg', 1200, 1257],
    ['Gud', 1202, 1203],
    ['Thartan', 1133, 1190],
    ['Chalicha', 1151, 1229],
    ['Rotrarel', 1153, 1216],
    ['Adaisilderde', 1156, 1230],
    ['Hischidal', 1158, 1217],
    ['Lidergudin', 1160, 1222],
    ['Bunogade', 1163, 1230],
    ['Adomai', 1166, 1254],
    ['Gungad', 1171, 1227],
    ['Odelh', 1166, 1266],
    ['Rerdare', 1192, 1258],
    ['Andiegend', 1195, 1197],
    ['Wararn', 1197, 1274],
    ['Waro', 1199, 1296],
    ['Audulino', 1201, 1202],
    ['Alegelis', 1203, 1204],
    ['Ansegino', 1206, 1266],
    ['Genadege', 1208, 1213],
    ['Benderar', 1211, 1253],
    ['Gudegerde', 1214, 1215],
    ['Fothen', 1224, 1300],
    ['Amessin', 1160, 1240],
    ['Martigut', 1184, 1185],
    ['Hicich', 1188, 1267],
    ['Bedegude', 1191, 1258],
    ['Rodarudra', 1194, 1264],
    ['Alatild', 1196, 1197],
    ['Silildo', 1199, 1264],
    ['Emelde', 1201, 1202]
  ].map(([name, x, y]) => ({
    name,
    start_at: DateTime.fromISO('2000-01-01').plus({ days: x * 5 }),
    end_at: DateTime.fromISO('2000-01-01').plus({ days: 60 + y * 5 })
  }))

  inject('route', [
    '/',
    p => () => {
      // const PlanningView = () => {
      //   const [scrollOffsetTop, setScrollOffsetTop] = React.useState(0)
      //   const [scrollOffsetLeft, setScrollOffsetLeft] = React.useState(0)

      //   const time_dims = [
      //     DateTime.min(...data.map(({ start_at}) => start_at)),
      //     DateTime.max(...data.map(({ end_at }) => end_at))
      //   ]
      //   const start_at = time_dims[0].startOf('month')
      //   const time_axis_size = time_dims[1].startOf('month').diff(start_at, ['months']).as('months') + 1
      //   const offset_to_time = n => {
      //     const d = start_at.plus({ months: n })
      //     return d.toFormat('MMM yy')
      //   }
      //   const time_window = dims => range(dims[0], dims[1]).map(offset_to_time)

      //   const task_dims = [0, data.length - 1]
      //   const task_axis_size = task_dims[1] - task_dims[0] + 1
      //   const offset_to_task = n => data[n].name
      //   const task_window = dims =>
      //     range(dims[0], dims[1]).map(offset_to_task)

      //   const cache = {}
      //   const assert = (r, c, fn) => {
      //     if (!cache[r]) cache[r] = {}
      //     if (!cache[r][c]) cache[r][c] = fn()
      //     return cache[r][c]
      //   }

      //   const schedule_window = (row_dims, col_dims) => {
      //     const time_dims = [
      //       start_at.plus({ months: col_dims[0] }),
      //       start_at.plus({ months: col_dims[1] + 1 })
      //     ]

      //     const items = range(row_dims[0], row_dims[1]).map(r => range(col_dims[0], col_dims[1]).map(i =>
      //       cache?.[r]?.[i]))

      //     const filtered_tasks = data
      //       .slice(row_dims[0], row_dims[1])
      //       .map((t, i) => ({ t, i }))
      //       .filter(({ t }) => t.end_at >= time_dims[0] && t.start_at < time_dims[1])
      //     for (const {t, i} of filtered_tasks) {
      //       const task_dims = [
      //         t.start_at.startOf('month').diff(start_at, ['months']).as('months'),
      //         t.end_at.startOf('month').diff(start_at, ['months']).as('months')
      //       ]

      //       const start_n = task_dims[0] - col_dims[0]
      //       const row_items = items[i]
      //       if (task_dims[0] == task_dims[1]) {
      //         if (!row_items[start_n])
      //           row_items[start_n] = assert(i, task_dims[0], () => ({
      //             type: 'startandend',
      //             t,
      //             start: offset_start(t.start_at),
      //             end: offset_end(t.end_at)
      //           }))
      //       }
      //       else {
      //         const end_n = task_dims[1] - col_dims[0]
      //         if (!row_items[start_n])
      //           row_items[start_n] = assert(i + row_dims[0], task_dims[0], () => ({ type: 'start', t, start: offset_start(t.start_at)}))
      //         if (!row_items[end_n])
      //           row_items[end_n] = assert(i + row_dims[0], task_dims[1], () => ({ type: 'end', t, end: offset_end(t.end_at) }))
      //         if (end_n - start_n > 1)
      //           for (const n of range(start_n + 1, end_n - 1))
      //             if (!row_items[n])
      //               row_items[n] = assert(i + row_dims[0], n + col_dims[0], () => ({ type: 'middle', t }))
      //       }
      //     }

      //     return items
      //   }

      //   return <div className='wrapper'>
      //     <div className='task-title'>
      //       Tasks
      //     </div>
      //     <TimelimeAxis
      //       setScrollOffsetLeft={setScrollOffsetLeft}
      //       scrollOffsetLeft={scrollOffsetLeft}
      //       size={time_axis_size}
      //       render={(virtualItems, render) => {
      //         const dims = [+Infinity, -Infinity]
      //         for (const i of virtualItems) {
      //           dims[0] = Math.min(dims[0], i.index)
      //           dims[1] = Math.max(dims[1], i.index)
      //         }
      //         const items = time_window(dims)
      //         return virtualItems.map(i => render(i, items[i.index - dims[0]]))
      //       }}
      //       />
      //     <TaskAxis
      //       setScrollOffsetTop={setScrollOffsetTop}
      //       scrollOffsetTop={scrollOffsetTop}
      //       data={data}
      //       size={task_axis_size}
      //       render={(virtualItems, render) => {
      //         const dims = [+Infinity, -Infinity]
      //         for (const i of virtualItems) {
      //           dims[0] = Math.min(dims[0], i.index)
      //           dims[1] = Math.max(dims[1], i.index)
      //         }
      //         const items = task_window(dims)
      //         return virtualItems.map(i => render(i, items[i.index - dims[0]]))
      //       }}
      //       />
      //     <Schedule
      //       setScrollOffsetTop={setScrollOffsetTop}
      //       scrollOffsetTop={scrollOffsetTop}
      //       setScrollOffsetLeft={setScrollOffsetLeft}
      //       scrollOffsetLeft={scrollOffsetLeft}
      //       row_size={task_axis_size}
      //       col_size={time_axis_size}
      //       render={(row_v, col_v, render) => {
      //         const row_dims = [+Infinity, -Infinity]
      //         for (const i of row_v) {
      //           row_dims[0] = Math.min(row_dims[0], i.index)
      //           row_dims[1] = Math.max(row_dims[1], i.index)
      //         }
      //         const col_dims = [+Infinity, -Infinity]
      //         for (const i of col_v) {
      //           col_dims[0] = Math.min(col_dims[0], i.index)
      //           col_dims[1] = Math.max(col_dims[1], i.index)
      //         }
      //         const items = schedule_window(row_dims, col_dims)

      //         return row_v.map(r =>
      //           col_v.map(c => render(r, c, items[r.index - row_dims[0]][c.index - col_dims[0]]))
      //         )
      //       }}
      //     />
      //   </div>
      // }

      // return <PlanningView />

      const [position, setPosition] = useState([100, 0])
      const [isDragging, setIsDragging] = useState(false)

      return (
        <Draggable
          position={position}
          onDragStart={() => {
            setIsDragging(true)
          }}
          onDrag={({ delta }) => [delta[0], delta[1]]}
          onDragEnd={useCallback(({ delta }) => {
            setIsDragging(false)
            setPosition(state => [
              state[0] + delta[0],
              state[1] + delta[1]
            ])
          })}
        >
          <span className={isDragging ? 'dragging-yes' : 'dragging-no'}>Hello</span>
        </Draggable>
      )
    }
  ])
})
