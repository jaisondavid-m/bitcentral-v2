package student

import (
	studentmodels "server/models/student"
)

// ============================================================================
// 11-11-2026 FORENOON SESSION (FN: 09:00 AM – 12:00 PM) - Total: 56 Students
// ============================================================================
func buildSeatingData11Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. BM - 22BMH36 (8 candidates)
		{HallNo: "WW 204", CourseCode: "22BMH36", RegisterNos: []string{
			"7376231BM105", "7376231BM109", "7376231BM114", "7376231BM115",
			"7376231BM130", "7376231BM133", "7376231BM145", "7376231BM151",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BTH32 (12 candidates)
		{HallNo: "WW 204", CourseCode: "22BTH32", RegisterNos: []string{
			"7376232BT113", "7376232BT121", "7376232BT128", "7376232BT138",
			"7376232BT139", "7376232BT158", "7376232BT167", "7376232BT169",
			"7376232BT171", "7376232BT184", "7376232BT207", "7376232BT211",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH05 (2 candidates)
		{HallNo: "WW 204", CourseCode: "22ITH05", RegisterNos: []string{
			"7376232IT127", "7376232IT161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH23 (3 candidates)
		{HallNo: "WW 204", CourseCode: "22AGH23", RegisterNos: []string{
			"7376232AG103", "7376232AG116", "7376232AG137",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CE - 22CEH42 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22CEH42", RegisterNos: []string{
			"7376231CE102",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ECH11 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH11", RegisterNos: []string{
			"7376231EC187", "7376231EC254", "7376231EC307",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ITM52* (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ITM52*", RegisterNos: []string{
			"7376231EC133", "7376231EC295", "7376231EC327",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EE - 22AMM46 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22AMM46", RegisterNos: []string{
			"7376231EE123",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22MEH40 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22MEH40", RegisterNos: []string{
			"7376231ME105", "7376231ME126", "7376231ME157",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BMM36 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22BMM36", RegisterNos: []string{
			"7376232BT133",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. FT - 22FTH17 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22FTH17", RegisterNos: []string{
			"7376232FT113", "7376232FT114",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH05 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22ITH05", RegisterNos: []string{
			"7376232IT257", "7376232IT271",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CT - 22CTH05 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22CTH05", RegisterNos: []string{
			"7376232CT126", "7376232CT132", "7376232CT134",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AD - 22AIH11* (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH11*", RegisterNos: []string{
			"7376232AD188", "7376232AD266",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AL - 22AMH36 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AMH36", RegisterNos: []string{
			"7376232AL129", "7376232AL132",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH23 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AGH23", RegisterNos: []string{
			"7376232AG138", "7376232AG145",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 6 candidates)
		// --------------------------------------------------------------------
		// B.E. EE - 22EEH17 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22EEH17", RegisterNos: []string{
			"7376231EE122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22AMM46 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22AMM46", RegisterNos: []string{
			"7376231ME161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. SE - 22ISH29 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22ISH29", RegisterNos: []string{
			"7376231SE116",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. MZ - 22MCH05 (2 candidates)
		{HallNo: "WW 206", CourseCode: "22MCH05", RegisterNos: []string{
			"7376231MZ112", "7376231MZ122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CB - 22CBH05 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22CBH05", RegisterNos: []string{
			"7376232CB136",
		}, Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 11-11-2026 AFTERNOON SESSION (AN: 01:30 PM – 04:30 PM) - Total: 147 Students
// ============================================================================
func buildSeatingData11Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH07 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC122", "7376241EC131", "7376241EC136", "7376241EC143",
			"7376241EC148", "7376241EC156", "7376241EC161", "7376241EC168",
			"7376241EC176", "7376241EC180",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH13 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AIH13", RegisterNos: []string{
			"7376242AD109", "7376242AD112", "7376242AD113", "7376242AD119",
			"7376242AD134", "7376242AD138", "7376242AD150", "7376242AD151",
			"7376242AD159", "7376242AD168", "7376242AD180", "7376242AD192",
			"7376242AD229", "7376242AD235", "7376242AD252",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH07 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC182", "7376241EC205", "7376241EC225", "7376241EC254",
			"7376241EC264", "7376241EC269", "7376241EC274", "7376241EC277",
			"7376241EC291", "7376241EC307",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE105",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH13 (14 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH13", RegisterNos: []string{
			"7376242AD256", "7376242AD275", "7376242AD283", "7376242AD284",
			"7376242AD290", "7376242AD300", "7376242AD302", "7376242AD309",
			"7376242AD318", "7376242AD330", "7376242AD339", "7376242AD340",
			"7376252AD507", "7376252AD514",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH30 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22CSH30", RegisterNos: []string{
			"7376241CS107", "7376241CS108", "7376241CS117", "7376241CS146",
			"7376241CS192",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EC - 22ECH07 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC317", "7376241EC331", "7376241EC343", "7376241EC347",
			"7376241EC352",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE111", "7376241EE119", "7376241EE126", "7376241EE131",
			"7376241EE134", "7376241EE156", "7376241EE164", "7376241EE169",
			"7376241EE173", "7376241EE180", "7376241EE182", "7376241EE184",
			"7376241EE186", "7376241EE187", "7376241EE192",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 207 (Total: 50 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH30 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22CSH30", RegisterNos: []string{
			"7376241CS238", "7376241CS245", "7376241CS262", "7376241CS309",
			"7376241CS338", "7376241CS343", "7376241CS375", "7376241CS389",
			"7376241CS432", "7376241CS452", "7376251CS523",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (2 candidates)
		{HallNo: "WW 207", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE201", "7376251EE509",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22MCH01 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22MCH01", RegisterNos: []string{
			"7376241MZ106", "7376241MZ114", "7376241MZ117", "7376241MZ128",
			"7376241MZ133", "7376241MZ136", "7376241MZ140", "7376241MZ148",
			"7376241MZ152", "7376241MZ154", "7376241MZ156",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. BT - 22BTH28 (15 candidates)
		{HallNo: "WW 207", CourseCode: "22BTH28", RegisterNos: []string{
			"7376242BT114", "7376242BT115", "7376242BT126", "7376242BT133",
			"7376242BT135", "7376242BT139", "7376242BT140", "7376242BT152",
			"7376242BT157", "7376242BT173", "7376242BT187", "7376242BT197",
			"7376242BT201", "7376242BT202", "7376242BT221",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH50 (3 candidates)
		{HallNo: "WW 207", CourseCode: "22ITH50", RegisterNos: []string{
			"7376242IT133", "7376242IT259", "7376242IT311",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH13 (8 candidates)
		{HallNo: "WW 207", CourseCode: "22AMH13", RegisterNos: []string{
			"7376242AL111", "7376242AL126", "7376242AL129", "7376242AL149",
			"7376242AL154", "7376242AL184", "7376242AL194", "7376242AL200",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 208 (Total: 22 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22AGM13 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376241CS126", "7376241CS328",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22CSM07 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22CSM07", RegisterNos: []string{
			"7376241EI108", "7376241EI115",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22EIH02 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22EIH02", RegisterNos: []string{
			"7376241EI102", "7376241EI132", "7376241EI147",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. ME - 22MEH36 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22MEH36", RegisterNos: []string{
			"7376241ME131", "7376241ME148", "7376241ME153",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22AIM43 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AIM43", RegisterNos: []string{
			"7376251MZ502",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22AGM13 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376242IT349",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH50 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22ITH50", RegisterNos: []string{
			"7376242IT326", "7376242IT333", "7376242IT344",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AGM13 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376242AD228", "7376242AD230",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH13 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AMH13", RegisterNos: []string{
			"7376242AL203",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AG - 22AGH13 (4 candidates)
		{HallNo: "WW 208", CourseCode: "22AGH13", RegisterNos: []string{
			"7376242AG104", "7376242AG110", "7376242AG113", "7376242AG115",
		}, Time: "01:30 PM – 04:30 PM"},
	}
}

// ============================================================================
// 13-11-2026 FORENOON SESSION (FN: 09:00 AM – 12:00 PM) - Total: 56 Students
// ============================================================================
func buildSeatingData13Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. BM - 22BMH37 (8 candidates)
		{HallNo: "WW 204", CourseCode: "22BMH37", RegisterNos: []string{
			"7376231BM105", "7376231BM109", "7376231BM114", "7376231BM115",
			"7376231BM130", "7376231BM133", "7376231BM145", "7376231BM151",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BTH33 (12 candidates)
		{HallNo: "WW 204", CourseCode: "22BTH33", RegisterNos: []string{
			"7376232BT113", "7376232BT121", "7376232BT128", "7376232BT138",
			"7376232BT139", "7376232BT158", "7376232BT167", "7376232BT169",
			"7376232BT171", "7376232BT184", "7376232BT207", "7376232BT211",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH06 (2 candidates)
		{HallNo: "WW 204", CourseCode: "22ITH06", RegisterNos: []string{
			"7376232IT127", "7376232IT161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH25 (3 candidates)
		{HallNo: "WW 204", CourseCode: "22AGH25", RegisterNos: []string{
			"7376232AG103", "7376232AG116", "7376232AG137",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CE - 22CEH25 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22CEH25", RegisterNos: []string{
			"7376231CE102",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ECH12 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH12", RegisterNos: []string{
			"7376231EC187", "7376231EC254", "7376231EC307",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ITM53* (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ITM53*", RegisterNos: []string{
			"7376231EC133", "7376231EC295", "7376231EC327",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EE - 22AMM47 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22AMM47", RegisterNos: []string{
			"7376231EE123",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22MEH17 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22MEH17", RegisterNos: []string{
			"7376231ME105", "7376231ME126", "7376231ME157",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BMM37 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22BMM37", RegisterNos: []string{
			"7376232BT133",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. FT - 22FTH18 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22FTH18", RegisterNos: []string{
			"7376232FT113", "7376232FT114",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH06 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22ITH06", RegisterNos: []string{
			"7376232IT257", "7376232IT271",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CT - 22CTH06 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22CTH06", RegisterNos: []string{
			"7376232CT126", "7376232CT132", "7376232CT134",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AD - 22AIH12 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH12", RegisterNos: []string{
			"7376232AD188", "7376232AD266",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AL - 22AMH37 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AMH37", RegisterNos: []string{
			"7376232AL129", "7376232AL132",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH25 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AGH25", RegisterNos: []string{
			"7376232AG138", "7376232AG145",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 6 candidates)
		// --------------------------------------------------------------------
		// B.E. EE - 22EEH18 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22EEH18", RegisterNos: []string{
			"7376231EE122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22AMM47 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22AMM47", RegisterNos: []string{
			"7376231ME161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. SE - 22ISH30 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22ISH30", RegisterNos: []string{
			"7376231SE116",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. MZ - 22MCH06 (2 candidates)
		{HallNo: "WW 206", CourseCode: "22MCH06", RegisterNos: []string{
			"7376231MZ112", "7376231MZ122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CB - 22CBH06 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22CBH06", RegisterNos: []string{
			"7376232CB136",
		}, Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 13-11-2026 AFTERNOON SESSION (AN: 01:30 PM – 04:30 PM) - Total: 147 Students
// ============================================================================
func buildSeatingData13Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH08 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC122", "7376241EC131", "7376241EC136", "7376241EC143",
			"7376241EC148", "7376241EC156", "7376241EC161", "7376241EC168",
			"7376241EC176", "7376241EC180",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH08 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AIH08", RegisterNos: []string{
			"7376242AD109", "7376242AD112", "7376242AD113", "7376242AD119",
			"7376242AD134", "7376242AD138", "7376242AD150", "7376242AD151",
			"7376242AD159", "7376242AD168", "7376242AD180", "7376242AD192",
			"7376242AD229", "7376242AD235", "7376242AD252",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH08 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC182", "7376241EC205", "7376241EC225", "7376241EC254",
			"7376241EC264", "7376241EC269", "7376241EC274", "7376241EC277",
			"7376241EC291", "7376241EC307",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE105",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH08 (14 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH08", RegisterNos: []string{
			"7376242AD256", "7376242AD275", "7376242AD283", "7376242AD284",
			"7376242AD290", "7376242AD300", "7376242AD302", "7376242AD309",
			"7376242AD318", "7376242AD330", "7376242AD339", "7376242AD340",
			"7376252AD507", "7376252AD514",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH31 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22CSH31", RegisterNos: []string{
			"7376241CS107", "7376241CS108", "7376241CS117", "7376241CS146",
			"7376241CS192",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EC - 22ECH08 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC317", "7376241EC331", "7376241EC343", "7376241EC347",
			"7376241EC352",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE111", "7376241EE119", "7376241EE126", "7376241EE131",
			"7376241EE134", "7376241EE156", "7376241EE164", "7376241EE169",
			"7376241EE173", "7376241EE180", "7376241EE182", "7376241EE184",
			"7376241EE186", "7376241EE187", "7376241EE192",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 207 (Total: 50 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH31 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22CSH31", RegisterNos: []string{
			"7376241CS238", "7376241CS245", "7376241CS262", "7376241CS309",
			"7376241CS338", "7376241CS343", "7376241CS375", "7376241CS389",
			"7376241CS432", "7376241CS452", "7376251CS523",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (2 candidates)
		{HallNo: "WW 207", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE201", "7376251EE509",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22MCH02 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22MCH02", RegisterNos: []string{
			"7376241MZ106", "7376241MZ114", "7376241MZ117", "7376241MZ128",
			"7376241MZ133", "7376241MZ136", "7376241MZ140", "7376241MZ148",
			"7376241MZ152", "7376241MZ154", "7376241MZ156",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. BT - 22BTH29 (15 candidates)
		{HallNo: "WW 207", CourseCode: "22BTH29", RegisterNos: []string{
			"7376242BT114", "7376242BT115", "7376242BT126", "7376242BT133",
			"7376242BT135", "7376242BT139", "7376242BT140", "7376242BT152",
			"7376242BT157", "7376242BT173", "7376242BT187", "7376242BT197",
			"7376242BT201", "7376242BT202", "7376242BT221",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH51 (3 candidates)
		{HallNo: "WW 207", CourseCode: "22ITH51", RegisterNos: []string{
			"7376242IT133", "7376242IT259", "7376242IT311",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH08 (8 candidates)
		{HallNo: "WW 207", CourseCode: "22AMH08", RegisterNos: []string{
			"7376242AL111", "7376242AL126", "7376242AL129", "7376242AL149",
			"7376242AL154", "7376242AL184", "7376242AL194", "7376242AL200",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 208 (Total: 22 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22AGM16 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376241CS126", "7376241CS328",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22CSM08 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22CSM08", RegisterNos: []string{
			"7376241EI108", "7376241EI115",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22EIH03 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22EIH03", RegisterNos: []string{
			"7376241EI102", "7376241EI132", "7376241EI147",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. ME - 22MEH37 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22MEH37", RegisterNos: []string{
			"7376241ME131", "7376241ME148", "7376241ME153",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22AIM45 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AIM45", RegisterNos: []string{
			"7376251MZ502",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22AGM16 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376242IT349",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH51 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22ITH51", RegisterNos: []string{
			"7376242IT326", "7376242IT333", "7376242IT344",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AGM16 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376242AD228", "7376242AD230",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH08 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AMH08", RegisterNos: []string{
			"7376242AL203",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AG - 22AGH16 (4 candidates)
		{HallNo: "WW 208", CourseCode: "22AGH16", RegisterNos: []string{
			"7376242AG104", "7376242AG110", "7376242AG113", "7376242AG115",
		}, Time: "01:30 PM – 04:30 PM"},
	}
}

